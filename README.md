# Verify Influencers

A platform designed to verify health claims made by influencers using AI and data analysis. This project represents an MVP (Minimum Viable Product) focused on demonstrating the core functionality and user interface.

## 🤖 Planned AI Architecture

This project was designed with a sophisticated AI agent architecture in mind. While the current implementation uses mocks for demonstration, the complete system was architected to use multiple specialized AI agents working together:

![AI Architecture Diagram](/docs/influencers-agents-architeture.png)

The planned architecture follows a pipeline of specialized AI agents:

1. **Content Discovery Agent**
   - Crawls social media and content platforms
   - Collects posts, videos, and podcast transcripts
   - Filters for health-related content

2. **Claim Extraction Agent**
   - Identifies specific health claims from content
   - Categorizes claims (Nutrition, Medicine, Mental Health, etc.)
   - Extracts context and supporting statements

3. **Deduplication Agent**
   - Uses semantic analysis to identify similar claims
   - Merges redundant claims while preserving context
   - Maintains links to original sources
   
4. **Scientific Verification Agent**
   - Cross-references claims with scientific literature
   - Evaluates evidence strength and consensus
   - Assigns verification status (Verified, Questionable, Debunked)

5. **Trust Score Calculator**
   - Aggregates verification results
   - Weighs factors like claim accuracy and evidence quality
   - Generates overall influencer reliability metrics

This pipeline ensures efficient processing while maintaining accuracy and completeness in the verification process.

## 🚀 Live Demo

Access the live demo at: [Verify Influencers Demo](https://influencers-quest-m06qfx87s-carlos-projects-73f29bb2.vercel.app/)

## 🛠 Implementation Details

### Current Implementation
- Implemented a functional UI matching the provided mockups
- Created a mock data system to simulate influencer data and claims
- Built a working search and filtering system
- Implemented responsive design for various screen sizes

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