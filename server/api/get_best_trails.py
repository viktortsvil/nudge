import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

# Define your agents with roles and goals
researcher = Agent(
  role='Hiking Research Analyst',
  goal='Discover the best hiking places around a specified city',
  backstory="""You are an outdoor enthusiast with extensive knowledge of hiking trails.
  Your expertise lies in finding and evaluating hiking spots based on their popularity and accessibility.""",
  verbose=True,
  allow_delegation=False,
  tools=[search_tool]
)
writer = Agent(
  role='Travel Content Writer',
  goal='Create an engaging guide on the top hiking places',
  backstory="""You are a seasoned travel writer known for your engaging and informative guides.
  You specialize in crafting content that is both helpful and interesting to readers.""",
  verbose=True,
  allow_delegation=True
)

# Specify the city for which we are finding hiking places
city = "San Francisco"

# Create tasks for your agents
task1 = Task(
  description=f"""Conduct research to find the top 5 hiking places around {city}.
  For each hike, include the name of the hike, how long it takes to complete, and how far it is from {city}.""",
  expected_output="List of top 5 hiking places with name, duration, and distance from the city and only output the top 5",
  agent=researcher
)

task2 = Task(
  description="""Using the research findings, write a detailed and engaging guide
  that highlights the top 5 hiking places. Include the name of each hike, the duration, and the distance from the city.
  Make it sound cool and accessible to a general audience.""",
  expected_output="List of the hikes places with name, duration, and distance from the city and only output the top 5",
  agent=writer
)

# Instantiate your crew with a sequential process
crew = Crew(
  agents=[researcher, writer],
  tasks=[task1, task2],
  verbose=1, # You can set it to 1 or 2 for different logging levels
  process=Process.sequential
)

# Get your crew to work!
result = crew.kickoff()

print("######################")
print(result)