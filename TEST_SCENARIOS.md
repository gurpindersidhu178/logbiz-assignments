# Real Submission Test Scenarios

## Scenario 1: Backend Developer - REST API
```python
test_case = {
    "name": "John Backend",
    "skills": ["Node.js", "Express", "MongoDB", "JWT", "Authentication"],
    "expected_assignment": "REST API with Authentication",
    "submission_path": "backend-development/rest-api-auth/solutions/john_backend",
    "expected_files": ["README.md", "app.js", "package.json", "tests/"]
}
```

## Scenario 2: Frontend Developer - E-commerce UI
```python
test_case = {
    "name": "Sarah Frontend", 
    "skills": ["React", "TypeScript", "CSS", "Responsive Design"],
    "expected_assignment": "E-commerce UI",
    "submission_path": "frontend-development/ecommerce-ui/solutions/sarah_frontend",
    "expected_files": ["README.md", "src/", "package.json", "public/"]
}
```

## Scenario 3: Data Scientist - ML Pipeline
```python
test_case = {
    "name": "Mike Data",
    "skills": ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
    "expected_assignment": "ML Pipeline", 
    "submission_path": "data-science/solutions/mike_data",
    "expected_files": ["README.md", "main.py", "requirements.txt", "notebooks/"]
}
```

## Validation Steps
1. Parse CV and extract skills
2. Assign appropriate task
3. Generate GitHub link
4. Send assignment email
5. Wait for submission
6. Validate submission quality
7. Test submitted solution
8. Merge to main branch
9. Run full system tests
