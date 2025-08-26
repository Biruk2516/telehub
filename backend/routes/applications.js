const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const multer = require('multer');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer storage for resume uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'resumes'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.rtf', '.txt'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  }
});

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Applicant only)
router.post('/', [
  auth,
  authorize('applicant'),
  upload.single('resume'),
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('coverLetter').notEmpty().withMessage('Cover letter is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      jobId,
      userId: req.user._id,
      coverLetter,
      resume: req.file ? `/uploads/resumes/${req.file.filename}` : undefined
    });

    await application.save();

    // Update job application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('newApplication', {
      jobId,
      jobTitle: job.title,
      applicantName: req.user.name
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('jobId', 'title company')
      .populate('userId', 'name email');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/user/:userId
// @desc    Get all applications by a user
// @access  Private (User can only see their own applications)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Check if user is requesting their own applications or is admin
    if (req.params.userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ userId: req.params.userId })
      .populate('jobId', 'title company location type')
      .populate('userId', 'name email')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job (employer only)
// @access  Private (Job creator or admin only)
router.get('/job/:jobId', [auth, authorize('employer', 'admin')], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job creator or admin
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('jobId', 'title company')
      .populate('userId', 'name email skills')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (employer or admin only)
// @access  Private
router.put('/:id/status', [
  auth,
  authorize('employer', 'admin'),
  body('status').isIn(['applied', 'shortlisted', 'rejected', 'hired']).withMessage('Invalid status'),
  body('notes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('jobId', 'createdBy');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the job creator or admin
    if (application.jobId.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        reviewedAt: Date.now(),
        reviewedBy: req.user._id
      },
      { new: true }
    )
    .populate('jobId', 'title company')
    .populate('userId', 'name email');

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics (admin only)
// @access  Private
router.get('/stats', [auth, authorize('admin')], async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentApplications = await Application.find()
      .populate('jobId', 'title')
      .populate('userId', 'name')
      .sort({ appliedAt: -1 })
      .limit(5);

    res.json({
      totalApplications,
      applicationsByStatus,
      recentApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
