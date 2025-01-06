import type OpenAI from 'openai'

// Function to simulate chain of thought reasoning
async function chainOfThought(
  openai: OpenAI,
  question: string,
  maxIterations: number = 3,
): Promise<string> {
  let context = `Question: ${question}\n`
  let iteration = 0

  while (iteration < maxIterations) {
    // Generate a response from the model
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Use GPT-4 or any other model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that thinks step by step.',
        },
        { role: 'user', content: context },
      ],
      temperature: 0.7,
    })

    const assistantResponse = response.choices[0].message.content

    // Update the context with the assistant's response
    context += `Thought ${iteration + 1}: ${assistantResponse}\n`

    // Check if the response seems final
    if (
      assistantResponse?.includes('final answer') ||
      assistantResponse?.includes('conclusion')
    ) {
      return assistantResponse
    }

    iteration++
  }

  return context // Return the final chain of thought
}

// Example usage
// (async () => {
//   const question = 'What is the square root of 144, and why?';
//   const answer = await chainOfThought(question);
//   console.log('Final Answer:', answer);
// })();
