from crewai_tools import SerperDevTool
from crewai import Agent, Task, Crew, Process
from langchain.output_parsers.json import parse_json_markdown

search_tool = SerperDevTool()


def get_suggestions(js, suggestion, artists, city='San Francisco') -> str:

    artists = [artists[0]]
    # Define your agents with roles and goals
    researcher = Agent(
        role='Activity Researcher',
        goal=f'Given a notification message about some health-related topic, output 5 options of activities that pertain to that message. It could be hikes, food recipes, meditations, song suggestions, etc. Output them as a json array of strings',
        backstory=f"Given a notification message about some health-related topic, output 5 different options of activities happening in {city} that pertain to that message. It could be hikes, food recipes, meditations, song suggestions, etc. For events, make sure that they are happening relevant to the current time (Aug 2024). Output them as a json array of strings",
        verbose=True,
        allow_delegation=False,
        max_iter=2,
        tools=[search_tool]
    )
    writer = Agent(
        role='Content Writer',
        goal='Given a list of artists and a json suggesting different activities, adapt the text to mention some of the artists who are likely to do those activities. Output as JSON',
        backstory="Given a list of artists and a json suggesting differnet activities, adapt the text to mention some of the artists who are likely to do those activities. Output as JSON",
        verbose=True,
        allow_delegation=False,
        tools=[search_tool],
        max_iter=6
    )

    # Create tasks for your agents
    task1 = Task(
        description=f"Here is the notification message: `{suggestion}`. Pull the activity from it and suggest 5 similar activities in {city} ",
        expected_output=f"JSON array of 5 five objects with fields 'description' and 'link', each describing one activity in {city} and optionally adding a link to the search result. Make sure the link works. Don't add the link to the 'description' field, only to the 'link' field",
        agent=researcher
    )

    task2 = Task(
        description=f"""Given activity sugegstions as a JSON array, make it more personalized by including some context about the artists relevant to those activities. Talk like the chosen artist but in a tough love manner. You can also make references to pop culture. Here are the artists: {', '.join(artists)}""",
        expected_output=f"JSON array of 5 strings, each describing one activity in {city}",
        agent=writer
    )

    # Instantiate your crew with a sequential process
    crew = Crew(
        agents=[researcher, writer],
        tasks=[task1, task2],
        verbose=1,  # You can set it to 1 or 2 for different logging levels
        process=Process.sequential
    )

    # Get your crew to work!
    result = crew.kickoff()
    a = result.tasks_output[-1].raw
    return parse_json_markdown(a)
