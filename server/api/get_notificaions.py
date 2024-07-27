import os
from typing import List

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool
from crewai_tools.tools.serper_dev_tool.serper_dev_tool import SerperDevToolSchema
from langchain_groq import ChatGroq


class SearchSchema(SerperDevToolSchema):
    search_query = ""


search_tool = SerperDevTool()

llm = ChatGroq(
    temperature=0.7,
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name='llama3-8b-8192'
)

# Define your agents with roles and goals
researcher = Agent(
    role='Funny Health Data App',
    goal='Given wellbeing scores of a person in a json file, output factors that bring the scores down, describe them each in one sentence with Duolingo notification energy',
    backstory="""You are a humorous health data analyst app. Your user gives you a json with their health scores and asks you what brigns them down. You analyze the set of scores and output several (as asked) popup-notification style descriptions of the negative factors. You only output these factors""",
    verbose=True,
    allow_delegation=False,
    #tools=[search_tool],
    llm=llm
)
# Specify the city for which we are finding hiking place

# Instantiate your crew with a sequential process


def get_notifs(data, n) -> List[str]:
    task1 = Task(
        description=f"""Provide {n} funny descriptions of factors that bring the scores down in a pop-up notificaiton format given the following json of health scores: {str(data)}\n\n\n Use funny casual language and don't mention actual scores. Be funny but not passive aggressive. Each sentence is a different notification so they should not be related to each other""",
        expected_output=f"{n} notification texts describing factors bringing the health scores down. Don't provide any other text; sentences should be independent from each other",
        agent=researcher,
    )
    crew = Crew(
        agents=[researcher],
        tasks=[task1],
        verbose=1,  # You can set it to 1 or 2 for different logging levels
        process=Process.sequential
    )
    result = crew.kickoff()
    result = result.tasks_output[0].raw.split('\n')
    return [r for r in result if r]


