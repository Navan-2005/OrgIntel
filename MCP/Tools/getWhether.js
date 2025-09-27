import { config } from "dotenv";
config();

export async function getWhether(city) {
    const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWHETHER_API}&units=metric`
    );
    const data = await response.json();
    console.log('Response from getWhether:', response);
    
    console.log('Data from getWhether:', data);

    // Extract a summary from the response
    if (data.cod !== 200) {
        return {
            content: [
                {
                    text: `Could not fetch weather for ${city}. Error: ${data.message}`,
                    type: "text"
                }
            ]
        };
    }

    const description = data.weather?.[0]?.description;
    const temperature = data.main?.temp;

    return {
        content: [
            {
                text: `The weather in ${city} is ${description} with a temperature of ${temperature}°C.`,
                type: "text"
            }
        ]
    };
}
