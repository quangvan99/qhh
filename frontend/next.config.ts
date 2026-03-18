import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.6.14', 'localhost'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.hue-s.vn' },
    ],
  },
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
    return [
      // Proxy /api/student/** → backend /api/v1/student/**
      // Frontend calls /api/student/* (test-mock-compatible short path),
      // Next.js rewrites transparently to real backend /api/v1/student/*.
      {
        source: '/api/student/:path*',
        destination: `${backendBase}/api/v1/student/:path*`,
      },
    ]
  },
  async redirects() {
    return [
      // /student/classes/* → /my-classes/*
      {
        source: '/student/classes',
        destination: '/my-classes',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/lesson/:lessonId',
        destination: '/my-classes/:classId/lesson/:lessonId',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/assignments/:assignmentId/:rest*',
        destination: '/my-classes/:classId/assignments/:assignmentId/:rest*',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/assignments/:assignmentId',
        destination: '/my-classes/:classId/assignments/:assignmentId',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/assignments',
        destination: '/my-classes/:classId/assignments',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/discussions/:threadId',
        destination: '/my-classes/:classId/discussions/:threadId',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/discussions',
        destination: '/my-classes/:classId/discussions',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/history',
        destination: '/my-classes/:classId/history',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/results',
        destination: '/my-classes/:classId/results',
        permanent: false,
      },
      {
        source: '/student/classes/:classId/announcements',
        destination: '/my-classes/:classId/announcements',
        permanent: false,
      },
      {
        source: '/student/classes/:classId',
        destination: '/my-classes/:classId',
        permanent: false,
      },
      // /student/exams/* → /my-exams/*
      {
        source: '/student/exams',
        destination: '/my-exams',
        permanent: false,
      },
      {
        source: '/student/exams/:examId/result/details',
        destination: '/my-exams/result/:examId/details',
        permanent: false,
      },
      {
        source: '/student/exams/:examId/result',
        destination: '/my-exams/result/:examId',
        permanent: false,
      },
      {
        source: '/student/exams/:examId/taking',
        destination: '/my-exams/room/:examId',
        permanent: false,
      },
      {
        source: '/student/exams/:examId/room',
        destination: '/my-exams/room/:examId',
        permanent: false,
      },
      {
        source: '/student/exams/:examId',
        destination: '/my-exams/register/:examId',
        permanent: false,
      },
      // /classes/* → /lms/classes/*
      {
        source: '/classes',
        destination: '/lms/classes',
        permanent: false,
      },
      {
        source: '/classes/new',
        destination: '/lms/classes/new',
        permanent: false,
      },
      {
        source: '/classes/:id/edit',
        destination: '/lms/classes/:id/edit',
        permanent: false,
      },
      {
        source: '/classes/:id/students',
        destination: '/lms/classes/:id/students',
        permanent: false,
      },
      {
        source: '/classes/:id/settings',
        destination: '/lms/classes/:id/settings',
        permanent: false,
      },
      {
        source: '/classes/:id/:rest*',
        destination: '/lms/classes/:id/:rest*',
        permanent: false,
      },
      {
        source: '/classes/:id',
        destination: '/lms/classes/:id',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
