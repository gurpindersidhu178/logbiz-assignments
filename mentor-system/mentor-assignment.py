#!/usr/bin/env python3
"""
Mentor Assignment System for LogbizTech Fresher Program
"""

import json
from datetime import datetime
from typing import Dict, List, Optional

class MentorAssignmentSystem:
    def __init__(self):
        self.mentors = {}
        self.freshers = {}
        self.assignments = {}
    
    def add_mentor(self, mentor_data):
        """Add a mentor to the system"""
        self.mentors[mentor_data['id']] = mentor_data
    
    def add_fresher(self, fresher_data):
        """Add a fresher to the system"""
        self.freshers[fresher_data['id']] = fresher_data
    
    def assign_mentor(self, fresher_id):
        """Assign best mentor to fresher"""
        if fresher_id not in self.freshers:
            return None
        
        fresher = self.freshers[fresher_id]
        best_mentor_id = None
        best_score = 0
        
        for mentor_id, mentor in self.mentors.items():
            if mentor['current_freshers'] >= mentor['max_freshers']:
                continue
            
            # Calculate skill match
            skill_match = len(set(mentor['skills']) & set(fresher['skills']))
            if skill_match > best_score:
                best_score = skill_match
                best_mentor_id = mentor_id
        
        if best_mentor_id:
            self.mentors[best_mentor_id]['current_freshers'] += 1
            return best_mentor_id
        
        return None
    
    def create_assignment(self, fresher_id, mentor_id):
        """Create assignment"""
        assignment_id = f"assignment_{len(self.assignments) + 1}"
        assignment = {
            'id': assignment_id,
            'fresher_id': fresher_id,
            'mentor_id': mentor_id,
            'status': 'pending',
            'assigned_date': datetime.now().isoformat(),
            'progress': 0
        }
        self.assignments[assignment_id] = assignment
        return assignment_id

# Sample data
sample_mentors = [
    {
        'id': 'mentor_1',
        'name': 'Sarah Johnson',
        'skills': ['javascript', 'react', 'typescript'],
        'max_freshers': 3,
        'current_freshers': 1
    },
    {
        'id': 'mentor_2', 
        'name': 'Mike Chen',
        'skills': ['python', 'flask', 'sql'],
        'max_freshers': 2,
        'current_freshers': 0
    }
]

sample_freshers = [
    {
        'id': 'fresher_1',
        'name': 'Alex Kumar',
        'skills': ['javascript', 'html'],
        'assignment_branch': 'frontend-development'
    },
    {
        'id': 'fresher_2',
        'name': 'Priya Singh', 
        'skills': ['python', 'sql'],
        'assignment_branch': 'backend-development'
    }
]

if __name__ == "__main__":
    system = MentorAssignmentSystem()
    
    # Add sample data
    for mentor in sample_mentors:
        system.add_mentor(mentor)
    
    for fresher in sample_freshers:
        system.add_fresher(fresher)
    
    # Assign mentors
    for fresher_id in system.freshers:
        mentor_id = system.assign_mentor(fresher_id)
        if mentor_id:
            assignment_id = system.create_assignment(fresher_id, mentor_id)
            print(f"Assigned {system.freshers[fresher_id]['name']} to {system.mentors[mentor_id]['name']}")
    
    print(f"\nTotal assignments: {len(system.assignments)}") 