'use client';
import { useState } from 'react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'Getting Started',
            questions: [
                {
                    question: 'What is SimplHost?',
                    answer: 'SimplHost is the simplest way to host and share your web projects. Upload your HTML files, PDFs, or use our templates to create a live website in seconds.'
                },
                {
                    question: 'How do I get started?',
                    answer: 'Simply visit our homepage, choose a link name, upload your file (HTML, ZIP, or PDF), and click Upload. Your site will be live instantly at your chosen subdomain.'
                },
                {
                    question: 'Do I need to create an account?',
                    answer: 'No! You can use our Free plan without creating an account. However, creating an account gives you access to manage your sites, track analytics, and unlock premium features.'
                }
            ]
        },
        {
            category: 'Pricing & Plans',
            questions: [
                {
                    question: 'What plans do you offer?',
                    answer: 'We offer three plans: Free (1 project, 25MB, 10K visits/mo), Solo (5 projects, 75MB, 100K visits/mo) at ₹550/month, and Pro (15 projects, 10GB, 500K visits/mo) at ₹1,300/month.'
                },
                {
                    question: 'Can I upgrade or downgrade my plan?',
                    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
                },
                {
                    question: 'Is there a free trial?',
                    answer: 'Our Free plan is available forever with no credit card required. For paid plans, we offer a 7-day money-back guarantee.'
                },
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, debit cards, and UPI payments for your convenience.'
                }
            ]
        },
        {
            category: 'Technical',
            questions: [
                {
                    question: 'What file types can I upload?',
                    answer: 'You can upload HTML files, ZIP archives containing your website files, and PDF documents. Make sure your main HTML file is named index.html if uploading a ZIP.'
                },
                {
                    question: 'What are the upload limits?',
                    answer: 'Free plan: 25MB per project, Solo plan: 75MB per project, Pro plan: 10GB per project.'
                },
                {
                    question: 'How many visitors can my site handle?',
                    answer: 'Free plan supports 10,000 visits/month, Solo supports 100,000 visits/month, and Pro supports 500,000 visits/month.'
                },
                {
                    question: 'Can I use my own domain?',
                    answer: 'Custom domains are available on Solo and Pro plans. You can connect your domain through your account dashboard.'
                }
            ]
        },
        {
            category: 'Account & Support',
            questions: [
                {
                    question: 'How do I manage my sites?',
                    answer: 'After creating an account and logging in, visit the "Manage Sites" page from the navigation menu to view, edit, and delete your hosted sites.'
                },
                {
                    question: 'How do I delete my account?',
                    answer: 'Contact our support team at support@simplhost.com to request account deletion. We\'ll process your request within 24 hours.'
                },
                {
                    question: 'How can I contact support?',
                    answer: 'You can reach us via email at support@simplhost.com. Solo and Pro plan users receive priority email support with faster response times.'
                },
                {
                    question: 'What is your refund policy?',
                    answer: 'We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 7 days of purchase for a full refund.'
                }
            ]
        }
    ];

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-4 py-16 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about SimplHost. Can't find what you're looking for?
                    </p>
                    <div className="mt-4">
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                            Contact our support team
                        </a>
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-12">
                    {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="text-4xl">
                                    {categoryIndex === 0 && '🚀'}
                                    {categoryIndex === 1 && '💰'}
                                    {categoryIndex === 2 && '⚙️'}
                                    {categoryIndex === 3 && '💬'}
                                </span>
                                {category.category}
                            </h2>

                            <div className="space-y-4">
                                {category.questions.map((faq, questionIndex) => {
                                    const index = `${categoryIndex}-${questionIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={questionIndex}
                                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-semibold text-lg text-gray-800 flex-1">
                                                    {faq.question}
                                                </span>
                                                <span className={`text-2xl text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                    ▼
                                                </span>
                                            </button>

                                            <div
                                                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    } overflow-hidden`}
                                            >
                                                <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-lg mb-6 opacity-90">
                        Our support team is here to help you get started
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/pricing"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                        >
                            View Pricing
                        </a>
                        <a
                            href="/register"
                            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
                        >
                            Get Started Free
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
