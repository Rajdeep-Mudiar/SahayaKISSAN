from langchain_community.llms import Ollama

llm=Ollama(
    model="llama2:latest",
    temperature=0.3
)