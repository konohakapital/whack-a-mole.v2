// utils/getRandomImage.ts

export const getRandomImage = (images: string[]): string => {
  const randomIndex = Math.floor(Math.random() * images.length); // Generate a random index
  return images[randomIndex]; // Return the random image URL
};
