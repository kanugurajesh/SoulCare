import { ArrowRight, MessageSquare, FileText, Zap, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <header>
        <title>About SoulCare - Your Mental Health Companion</title>
        <meta
          name="description"
          content="Discover SoulCare, a mental health app that leverages advanced NLP for sentiment analysis, symptom tracking, and real-time support."
        />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          About SoulCare
        </h1>

        <section className="mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Welcome to SoulCare, your mental health companion! Our app utilizes advanced natural language processing to analyze social media sentiment, track health symptoms, and provide real-time support tailored to your needs.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            SoulCare empowers users to engage in meaningful conversations about their mental health and wellbeing, offering personalized reports and a Cognitive Behavioral Therapy (CBT) bot to enhance your journey toward better mental health.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
              title="Personalized Support"
              description="Engage in natural conversations with our AI to receive tailored advice based on your data."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title="RAG File Upload"
              description="Upload your medical files to receive relevant information and insights tailored to your health needs."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-blue-600" />}
              title="Gamified Engagement"
              description="Enhance your experience with gamified features that motivate you to engage regularly."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-blue-600" />}
              title="Secure & Confidential"
              description="Enjoy secure authentication and complete control over your data and files stored in the application."
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Our Technology Stack
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Advanced NLP:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {" "} Powering our sentiment analysis and user interaction capabilities.
                </span>
              </div>
            </li>
            <li className="flex items-start">
              <ArrowRight className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Real-Time Support:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {" "} Providing immediate assistance and resources for your mental health needs.
                </span>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Get Started
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Ready to take charge of your mental health journey? Start engaging with SoulCare today!
          </p>
          <a
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Sign Up for SoulCare
          </a>
        </section>
      </main>
    </div>
  );
};

export default About;
