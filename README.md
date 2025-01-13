# Verify Influencers

A platform designed to verify health claims made by influencers using AI and data analysis. This project represents an MVP (Minimum Viable Product) focused on demonstrating the core functionality and user interface.

## 🚀 Live Demo

Access the live demo at: [Verify Influencers Demo](https://influencers-quest-m06qfx87s-carlos-projects-73f29bb2.vercel.app/)

## 🛠 Implementation Details

### Current Implementation
- Implemented a functional UI matching the provided mockups
- Created a mock data system to simulate influencer data and claims
- Built a working search and filtering system
- Implemented responsive design for various screen sizes

## Implementation Notes

While the local development version included real-time Instagram data fetching using Python, the production demo uses mocked data to ensure stable demonstration of the UI and core functionality. This decision was made to prioritize reliable deployment and showcase the application's interface and workflow. In a production environment, this would be implemented using:
- A proper backend service for Instagram data fetching
- API rate limiting and caching
- Proper error handling for external service dependencies

### Technical Decisions
- Used mock data instead of direct API integrations to demonstrate functionality without external dependencies
- Focused on creating a smooth user experience with immediate feedback
- Implemented a scalable architecture that can be extended with real API integrations

### Future Enhancements
- Integration with OpenAI/Perplexity API for automated claim analysis
- Real-time social media data fetching
- Advanced scientific paper verification system
- Enhanced analytics and reporting features

## 🔧 Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide Icons
- **State Management:** React Context
- **Deployment:** Vercel

## 📁 Project Structure

```
verify-influencers/
├── src/
│   ├── app/                  # Next.js pages using App Router
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Base UI components
│   │   └── features/        # Feature-specific components
│   ├── contexts/            # React contexts for state management
│   └── lib/                 # Utilities and mocked data
├── public/                  # Static files
└── package.json            # Project dependencies
```

## ⚙️ Setup Instructions

1. **Clone the repository:**
```bash
git clone [repository-url]
cd verify-influencers
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌟 Features

- ✅ Influencer Search & Discovery
- ✅ Health Claim Analysis
- ✅ Scientific Verification Interface
- ✅ Interactive Dashboard
- ✅ Detailed Influencer Profiles
- ✅ Claim Categorization
- ✅ Trust Score Calculation

## 🚀 Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Configure build settings (if needed)
5. Deploy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Notes

This implementation represents an MVP focused on demonstrating the core functionality and user interface. While some features use mock data, the architecture is designed to be easily extensible for integration with real APIs and data sources.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.