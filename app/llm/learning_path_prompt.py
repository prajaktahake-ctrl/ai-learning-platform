LEARNING_PATH_PROMPT = """
You are an expert AI learning mentor and curriculum designer.

Create a structured learning path.

Skill: {goal}
Level: {level}
Duration: {duration_weeks} weeks

Rules:
1. Topics must progress from beginner to advanced.
2. Each topic should contain 3 to 5 subtopics.
3. Subtopics should represent specific concepts inside the topic.
4. Each topic should take 3 to 7 days.
5. Return ONLY valid JSON.

Return format:

{{
  "title": "Learning Path Title",
  "topics": [
    {{
      "title": "Topic name",
      "subtopics": ["Subtopic1", "Subtopic2", "Subtopic3"],
      "difficulty_level": "Beginner | Intermediate | Advanced",
      "order_index": 1,
      "estimated_days": 5
    }}
  ]
}}
"""