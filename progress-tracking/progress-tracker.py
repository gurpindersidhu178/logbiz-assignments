#!/usr/bin/env python3
"""
Progress Tracking System for LogbizTech Fresher Program
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List

class ProgressTracker:
    def __init__(self):
        self.projects = {}
        self.milestones = {}
        self.check_ins = {}
    
    def create_project(self, project_id, fresher_id, assignment_branch, start_date, end_date):
        """Create a new project for tracking"""
        project = {
            'id': project_id,
            'fresher_id': fresher_id,
            'assignment_branch': assignment_branch,
            'start_date': start_date,
            'end_date': end_date,
            'status': 'in_progress',
            'progress': 0,
            'milestones': [],
            'check_ins': []
        }
        self.projects[project_id] = project
        return project
    
    def add_milestone(self, project_id, milestone_id, title, description, due_date, weight):
        """Add milestone to project"""
        milestone = {
            'id': milestone_id,
            'title': title,
            'description': description,
            'due_date': due_date,
            'weight': weight,
            'status': 'pending',
            'completed_date': None
        }
        
        if project_id in self.projects:
            self.projects[project_id]['milestones'].append(milestone)
            self.milestones[milestone_id] = milestone
    
    def complete_milestone(self, milestone_id):
        """Mark milestone as completed"""
        if milestone_id in self.milestones:
            self.milestones[milestone_id]['status'] = 'completed'
            self.milestones[milestone_id]['completed_date'] = datetime.now().isoformat()
            self._update_project_progress(milestone_id)
    
    def _update_project_progress(self, milestone_id):
        """Update project progress based on completed milestones"""
        milestone = self.milestones[milestone_id]
        
        # Find project containing this milestone
        for project_id, project in self.projects.items():
            if any(m['id'] == milestone_id for m in project['milestones']):
                total_weight = sum(m['weight'] for m in project['milestones'])
                completed_weight = sum(m['weight'] for m in project['milestones'] 
                                     if m['status'] == 'completed')
                project['progress'] = (completed_weight / total_weight) * 100
                break
    
    def add_check_in(self, project_id, check_in_id, date, progress, notes, blockers):
        """Add progress check-in"""
        check_in = {
            'id': check_in_id,
            'date': date,
            'progress': progress,
            'notes': notes,
            'blockers': blockers
        }
        
        if project_id in self.projects:
            self.projects[project_id]['check_ins'].append(check_in)
            self.check_ins[check_in_id] = check_in
    
    def get_project_progress(self, project_id):
        """Get detailed progress for a project"""
        if project_id not in self.projects:
            return None
        
        project = self.projects[project_id]
        return {
            'project': project,
            'milestones': [self.milestones[m['id']] for m in project['milestones']],
            'recent_check_ins': project['check_ins'][-5:],  # Last 5 check-ins
            'overdue_milestones': self._get_overdue_milestones(project_id)
        }
    
    def _get_overdue_milestones(self, project_id):
        """Get overdue milestones for a project"""
        overdue = []
        if project_id in self.projects:
            for milestone in self.projects[project_id]['milestones']:
                if (milestone['status'] == 'pending' and 
                    datetime.fromisoformat(milestone['due_date']) < datetime.now()):
                    overdue.append(milestone)
        return overdue
    
    def generate_progress_report(self, fresher_id):
        """Generate progress report for a fresher"""
        fresher_projects = [p for p in self.projects.values() if p['fresher_id'] == fresher_id]
        
        if not fresher_projects:
            return None
        
        total_progress = sum(p['progress'] for p in fresher_projects) / len(fresher_projects)
        completed_milestones = sum(len([m for m in p['milestones'] if m['status'] == 'completed']) 
                                  for p in fresher_projects)
        total_milestones = sum(len(p['milestones']) for p in fresher_projects)
        
        return {
            'fresher_id': fresher_id,
            'total_projects': len(fresher_projects),
            'average_progress': total_progress,
            'milestones_completed': completed_milestones,
            'total_milestones': total_milestones,
            'completion_rate': (completed_milestones / total_milestones * 100) if total_milestones > 0 else 0,
            'projects': fresher_projects
        }

# Sample data for Task Tracker project
task_tracker_milestones = [
    {
        'id': 'milestone_1',
        'title': 'Project Setup',
        'description': 'Set up Next.js project with TypeScript and Tailwind CSS',
        'due_date': '2024-01-20',
        'weight': 10
    },
    {
        'id': 'milestone_2', 
        'title': 'Basic UI Components',
        'description': 'Create layout, navigation, and basic components',
        'due_date': '2024-01-25',
        'weight': 15
    },
    {
        'id': 'milestone_3',
        'title': 'Task Management',
        'description': 'Implement task creation, editing, and deletion',
        'due_date': '2024-02-01',
        'weight': 25
    },
    {
        'id': 'milestone_4',
        'title': 'State Management',
        'description': 'Add task filtering, search, and statistics',
        'due_date': '2024-02-08',
        'weight': 20
    },
    {
        'id': 'milestone_5',
        'title': 'Polish & Deploy',
        'description': 'Add animations, responsive design, and deploy to Vercel',
        'due_date': '2024-02-15',
        'weight': 30
    }
]

if __name__ == "__main__":
    tracker = ProgressTracker()
    
    # Create sample project
    project_id = tracker.create_project(
        'project_1',
        'fresher_1',
        'frontend-development',
        '2024-01-15',
        '2024-02-15'
    )
    
    # Add milestones
    for milestone in task_tracker_milestones:
        tracker.add_milestone(
            project_id,
            milestone['id'],
            milestone['title'],
            milestone['description'],
            milestone['due_date'],
            milestone['weight']
        )
    
    # Simulate progress
    tracker.complete_milestone('milestone_1')
    tracker.complete_milestone('milestone_2')
    
    # Add check-in
    tracker.add_check_in(
        project_id,
        'check_in_1',
        datetime.now().isoformat(),
        25,
        'Completed project setup and basic UI components. Starting task management features.',
        'Need clarification on task priority system design.'
    )
    
    # Generate report
    report = tracker.generate_progress_report('fresher_1')
    print("Progress Report:")
    print(json.dumps(report, indent=2)) 