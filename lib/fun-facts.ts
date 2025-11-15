// Fun facts for loading state - may or may not be related to blogging
export const funFacts = [
  // Blogging & Writing Related
  "Did you know? The first blog was created in 1994, making blogs almost 30 years old!",
  "Fact: Studies show that readers spend an average of 36 seconds on a blog post before deciding to stay or leave.",
  "Did you know? Long-form blog posts (over 1,500 words) tend to get 69% more shares than shorter articles.",
  "Fact: The word 'blog' is a shortened form of 'weblog,' coined in 1997.",
  "Did you know? Readers are 80% more likely to return to a blog with a consistent posting schedule.",

  // Random & Unrelated Facts
  "Did you know? Honey never spoils. Archaeologists have found pots of honey in Egyptian tombs that are over 3,000 years old and still edible!",
  "Fact: A group of flamingos is called a 'flamboyance.'",
  "Did you know? Octopuses have three hearts – two pump blood to the gills, and one pumps it to the rest of the body.",
  "Fact: The shortest war in history lasted only 38 minutes, between Britain and Zanzibar in 1896.",
  "Did you know? Bananas are berries, but strawberries aren't technically berries!",
  "Fact: A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "Did you know? Penguins have knees, but you can't see them because they're hidden inside their fluffy bodies.",
  "Fact: Cleopatra lived closer to the invention of the internet than to the building of the Great Pyramid.",
  "Did you know? Wombats produce cube-shaped poop that doesn't roll away!",
  "Fact: The smell of coffee can improve your focus and memory.",

  // Technology & Internet Related
  "Did you know? The first email was sent in 1971, before the internet existed as we know it today.",
  "Fact: Over 500 million tweets are sent every single day.",
  "Did you know? The @ symbol is called different things around the world – 'monkey's tail' in some countries!",
  "Fact: It would take 2 million years to watch all the content on YouTube if it was released in one day.",

  // More Random Facts
  "Did you know? A giraffe's tongue can be up to 20 inches long!",
  "Fact: Cats can rotate their ears independently up to 180 degrees.",
  "Did you know? A group of crows is called a 'murder.'",
  "Fact: Sharks are older than dinosaurs by about 200 million years.",
  "Did you know? You can't sneeze with your eyes open (unless you've had eye surgery).",
  "Fact: A cockroach can live for a week without its head!",
  "Did you know? The Eiffel Tower can grow up to 15 cm taller during hot weather due to thermal expansion.",
  "Fact: Your nose can remember 50,000 different smells.",
  "Did you know? Sloths only defecate once a week.",
  "Fact: A group of unicorns is called a 'blessing.'",

  // AI & Writing Technology
  "Did you know? The first AI chatbot, ELIZA, was created in 1966 and could fool people into thinking they were talking to a therapist!",
  "Fact: Modern AI models can generate human-like text by predicting the most likely next word based on patterns in billions of documents.",

  // More Fun Ones
  "Did you know? A day on Venus is longer than its year!",
  "Fact: Peanuts aren't actually nuts – they're legumes, like peas and beans.",
  "Did you know? The British Royal Family doesn't have a surname; they're just called 'The Royal Family.'",
  "Fact: An alligator can survive for up to 2 years without eating.",
  "Did you know? Pearls dissolve in vinegar!",
  "Fact: The fingerprints of koalas are so similar to human fingerprints that they've been confused at crime scenes!",
  "Did you know? A 'jiffy' is an actual unit of time equal to one trillionth of a second.",
  "Fact: Butterflies taste with their feet.",
  "Did you know? Russia has an anti-emoji law!",
  "Fact: The Great Wall of China isn't visible from space without magnification.",
]

// Get a random fun fact
export function getRandomFunFact(query?: string): string {
  return funFacts[Math.floor(Math.random() * funFacts.length)]
}

// Get a rotating fun fact based on an index
export function getRotatingFunFact(index: number): string {
  return funFacts[index % funFacts.length]
}
