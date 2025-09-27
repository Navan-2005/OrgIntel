import loudness from "loudness";

export async function adjustVolume(direction, amount) {
  const current = await loudness.getVolume();
  const newVolume = direction === "up"
    ? Math.min(100, current + amount)
    : Math.max(0, current - amount);

  await loudness.setVolume(newVolume);

  return {
    content: [
      {
        type: "text",
        text: `Volume ${direction === "up" ? "increased" : "decreased"} to ${newVolume}%`
      }
    ]
  };
}
