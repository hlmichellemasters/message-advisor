import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const message = req.body.message || '';
  console.log(message);
  const prompt = generatePrompt(message);
  console.log(prompt);

  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid message',
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 2048,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(message) {
  //   const capitalizedAnimal =
  //     animal[0].toUpperCase() + animal.slice(1).toLowerCase();

  return `Provide insight and advice and an example response for an ENFP responding to the following text message from an INFJ person:
  ${message} `;
}
//For ENFP: I'm sorry that I hurt your feelings. I understand how you feel, and I want to make sure that I don't do it again. Can you tell me what I did that hurt you so I can make sure I don't do it again in the future?
//For INFJ: I'm sorry that I hurt your feelings. I understand how you feel and I respect your decision to not want to text anymore. I hope that in time you'll forgive me and we can talk things through.
