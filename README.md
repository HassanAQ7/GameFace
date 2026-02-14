# GameFace

Mood-based game recommendation system. Upload a picture or take one with your webcam, and GameFace detects your emotions then recommends games that match your current mood.

## Link
https://game-face.vercel.app/

## Demo (TBD)



## Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS v4
- TanStack Router
- Vite

### Backend
- FastAPI 
- AWS Lambda
- Amazon Rekognition (emotion detection)
- AWS DynamoDB (recommendation history)
- RAWG API (game data)

### Deployment
- Frontend: Vercel
- Backend: AWS Lambda

## Features

- **Webcam capture** or **image upload** with multiple supported file types and drag and drop
- Real-time facial emotion detection powered Amazon Rekognition
- Game recommendations tailored to 8 detected emotions (Happy, Sad, Angry, Calm, Surprised, Confused, Disgusted, Fear)
- Recommendation history per session
- Fully responsive UI

## Rule-Based Recommendations with Emotion-to-Game Mapping

| Emotion | Game Genres |
|---------|------------|
| Happy | Platformer, Racing, Sports, Arcade |
| Sad | Adventure, Indie, RPG |
| Angry | Action, Shooter, Fighting |
| Calm | Puzzle, Simulation, Strategy |
| Surprised | Adventure, Action (Horror) |
| Confused | Puzzle, Strategy |
| Disgusted | Action, Fighting |
| Fear | Adventure, Action (Horror/Survival) |


## Future Considerations
- Upgrade from rule-based recommendations to ML-based ones
- Add user authentication
- Add a feedback system on accuracy of recommendations

## Acknowledgments
- Game data provided by [RAWG](https://rawg.io)

