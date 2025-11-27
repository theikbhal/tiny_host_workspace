'use client';
import Link from 'next/link';

const articles = [
    {
        id: 1,
        title: "How to Upload ZIP Files to SimplHost",
        date: "November 27, 2024",
        category: "Tutorial",
        excerpt: "Learn how to quickly upload and deploy your entire web project using ZIP files.",
        content: `
      <h2>Uploading ZIP Files Made Simple</h2>
      <p>SimplHost makes it incredibly easy to deploy your web projects. Here's how to upload ZIP files:</p>
      
      <h3>Step 1: Prepare Your Project</h3>
      <ul>
        <li>Ensure your project has an <code>index.html</code> file in the root directory</li>
        <li>Include all assets (CSS, JavaScript, images) in the ZIP</li>
        <li>Keep your file structure organized</li>
      </ul>
      
      <h3>Step 2: Create a ZIP File</h3>
      <ul>
        <li><strong>Windows:</strong> Right-click your project folder → Send to → Compressed (zipped) folder</li>
        <li><strong>Mac:</strong> Right-click your project folder → Compress</li>
        <li><strong>Linux:</strong> Use <code>zip -r project.zip project-folder/</code></li>
      </ul>
      
      <h3>Step 3: Upload to SimplHost</h3>
      <ol>
        <li>Visit <a href="/">SimplHost.com</a></li>
        <li>Choose a custom link name (e.g., "my-portfolio")</li>
        <li>Drag & drop your ZIP file or click "Upload file"</li>
        <li>Click "Upload" and you're live!</li>
      </ol>
      
      <p><strong>Pro Tip:</strong> Your site will be available at <code>your-name.simplhost.com</code> within seconds!</p>
    `
    },
    {
        id: 2,
        title: "Create HTML Websites with ChatGPT and Deploy Instantly",
        date: "November 26, 2024",
        category: "AI & Web Development",
        excerpt: "Use AI to build beautiful websites and host them on SimplHost in minutes.",
        content: `
      <h2>AI-Powered Web Development</h2>
      <p>ChatGPT can help you create stunning websites without coding knowledge. Here's how:</p>
      
      <h3>Step 1: Ask ChatGPT to Create Your Website</h3>
      <p>Example prompts:</p>
      <ul>
        <li>"Create a personal portfolio website with HTML and CSS"</li>
        <li>"Build a landing page for my coffee shop with contact form"</li>
        <li>"Design a simple blog layout with responsive design"</li>
      </ul>
      
      <h3>Step 2: Save the Code</h3>
      <ol>
        <li>Copy the HTML code ChatGPT provides</li>
        <li>Save it as <code>index.html</code> on your computer</li>
        <li>If CSS is separate, save it as <code>style.css</code></li>
        <li>Save any JavaScript as <code>script.js</code></li>
      </ol>
      
      <h3>Step 3: Deploy to SimplHost</h3>
      <ul>
        <li>If you have multiple files, ZIP them together</li>
        <li>Upload to SimplHost</li>
        <li>Share your link instantly!</li>
      </ul>
      
      <p><strong>Why This Works:</strong> No need for complex build tools, hosting panels, or technical setup. Just create and deploy!</p>
    `
    },
    {
        id: 3,
        title: "Deploy Your React.js Todo App in Minutes",
        date: "November 25, 2024",
        category: "React Tutorial",
        excerpt: "Build a React todo app and learn how to deploy it to SimplHost effortlessly.",
        content: `
      <h2>React App Deployment Made Easy</h2>
      <p>Created a React app? Here's how to deploy it to SimplHost:</p>
      
      <h3>Step 1: Build Your React App</h3>
      <pre><code>npm run build</code></pre>
      <p>This creates a <code>build</code> folder with optimized production files.</p>
      
      <h3>Step 2: Create a ZIP File</h3>
      <ul>
        <li>Navigate to the <code>build</code> folder</li>
        <li>Select all files inside (not the folder itself)</li>
        <li>Create a ZIP archive</li>
      </ul>
      
      <h3>Step 3: Upload to SimplHost</h3>
      <ol>
        <li>Go to SimplHost</li>
        <li>Choose your custom domain name</li>
        <li>Upload the ZIP file</li>
        <li>Your React app is now live!</li>
      </ol>
      
      <h3>Example: Todo App</h3>
      <p>A simple React todo app typically includes:</p>
      <ul>
        <li>Component for adding tasks</li>
        <li>List to display tasks</li>
        <li>Delete/complete functionality</li>
        <li>Local storage for persistence</li>
      </ul>
      
      <p><strong>Note:</strong> SimplHost is perfect for static React apps. For apps requiring a backend, consider using our API integration features.</p>
    `
    },
    {
        id: 4,
        title: "Vue.js Projects: From Development to Deployment",
        date: "November 24, 2024",
        category: "Vue.js Tutorial",
        excerpt: "Deploy your Vue.js applications with SimplHost's straightforward hosting solution.",
        content: `
      <h2>Vue.js Deployment Guide</h2>
      <p>Vue.js developers love SimplHost for its simplicity. Here's your deployment workflow:</p>
      
      <h3>Step 1: Build Your Vue App</h3>
      <pre><code>npm run build</code></pre>
      <p>This generates a <code>dist</code> folder with production-ready files.</p>
      
      <h3>Step 2: Prepare for Upload</h3>
      <ul>
        <li>Open the <code>dist</code> folder</li>
        <li>Verify <code>index.html</code> is present</li>
        <li>Check that all assets are included</li>
      </ul>
      
      <h3>Step 3: ZIP and Deploy</h3>
      <ol>
        <li>Compress the contents of the <code>dist</code> folder</li>
        <li>Upload to SimplHost</li>
        <li>Choose a memorable subdomain</li>
        <li>Click Upload - done!</li>
      </ol>
      
      <h3>Vue Router Configuration</h3>
      <p>If using Vue Router in history mode, ensure your app handles 404s properly with a fallback to index.html.</p>
      
      <p><strong>Perfect For:</strong> Portfolio sites, SPAs, dashboards, and prototypes built with Vue.js.</p>
    `
    },
    {
        id: 5,
        title: "SimplHost for Students: Your Free Web Hosting Solution",
        date: "November 23, 2024",
        category: "Education",
        excerpt: "Students can showcase projects, build portfolios, and learn web development with SimplHost.",
        content: `
      <h2>Why Students Love SimplHost</h2>
      <p>SimplHost is the perfect platform for students learning web development:</p>
      
      <h3>1. Portfolio Projects</h3>
      <ul>
        <li>Showcase your class projects instantly</li>
        <li>Share links with professors and potential employers</li>
        <li>Build a professional portfolio without costs</li>
      </ul>
      
      <h3>2. Learning & Experimentation</h3>
      <ul>
        <li>Test HTML/CSS/JavaScript skills in real-world scenarios</li>
        <li>Deploy practice projects from coding bootcamps</li>
        <li>Experiment with frameworks like React, Vue, or Angular</li>
      </ul>
      
      <h3>3. Group Projects</h3>
      <ul>
        <li>Collaborate on team assignments</li>
        <li>Share prototypes with classmates</li>
        <li>Present live demos during presentations</li>
      </ul>
      
      <h3>4. No Technical Barriers</h3>
      <ul>
        <li>No credit card required</li>
        <li>No complex configuration</li>
        <li>No command-line expertise needed</li>
        <li>Deploy in under 60 seconds</li>
      </ul>
      
      <h3>Use Cases for Students:</h3>
      <ul>
        <li>Personal resume/CV websites</li>
        <li>Class project demonstrations</li>
        <li>Hackathon prototypes</li>
        <li>Club or organization websites</li>
        <li>Research project presentations</li>
      </ul>
      
      <p><strong>Student Tip:</strong> Create multiple projects and organize them with descriptive subdomain names!</p>
    `
    },
    {
        id: 6,
        title: "Small Business Guide: Quick & Affordable Web Presence",
        date: "November 22, 2024",
        category: "Business",
        excerpt: "Small businesses can establish an online presence quickly and affordably with SimplHost.",
        content: `
      <h2>SimplHost for Small Businesses</h2>
      <p>Get your business online without the complexity or high costs:</p>
      
      <h3>1. Landing Pages</h3>
      <ul>
        <li>Create a simple one-page site with your services</li>
        <li>Include contact information and business hours</li>
        <li>Add a contact form or booking link</li>
        <li>Deploy in minutes, not days</li>
      </ul>
      
      <h3>2. Product Showcases</h3>
      <ul>
        <li>Display your products or services with images</li>
        <li>Share catalogs with potential clients</li>
        <li>Update pricing and offerings easily</li>
      </ul>
      
      <h3>3. Event Promotions</h3>
      <ul>
        <li>Create temporary sites for special events</li>
        <li>Promote sales or seasonal offerings</li>
        <li>Share event details and registration</li>
      </ul>
      
      <h3>4. Client Presentations</h3>
      <ul>
        <li>Share proposals and mockups</li>
        <li>Present design concepts to clients</li>
        <li>Collaborate on project ideas</li>
      </ul>
      
      <h3>Cost Benefits:</h3>
      <ul>
        <li>No monthly hosting fees to start</li>
        <li>No domain registration required initially</li>
        <li>No developer needed for simple sites</li>
        <li>Scale up only when you need to</li>
      </ul>
      
      <h3>Perfect For:</h3>
      <ul>
        <li>Local restaurants and cafes</li>
        <li>Freelancers and consultants</li>
        <li>Retail shops</li>
        <li>Service providers</li>
        <li>Event planners</li>
      </ul>
      
      <p><strong>Business Tip:</strong> Start simple, test your message, then upgrade to a custom domain when ready!</p>
    `
    },
    {
        id: 7,
        title: "SimplHost vs GitHub Pages, Vercel, GoDaddy & Hostinger",
        date: "November 21, 2024",
        category: "Comparison",
        excerpt: "See how SimplHost's simplicity compares to other popular hosting solutions.",
        content: `
      <h2>Hosting Comparison: Simplicity First</h2>
      <p>Let's compare SimplHost with popular alternatives:</p>
      
      <h3>SimplHost vs GitHub Pages</h3>
      <table>
        <tr>
          <th>Feature</th>
          <th>SimplHost</th>
          <th>GitHub Pages</th>
        </tr>
        <tr>
          <td>Setup Time</td>
          <td>30 seconds</td>
          <td>5-10 minutes</td>
        </tr>
        <tr>
          <td>Git Required</td>
          <td>No</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Upload Method</td>
          <td>Drag & drop ZIP</td>
          <td>Git push</td>
        </tr>
        <tr>
          <td>Best For</td>
          <td>Quick prototypes, non-developers</td>
          <td>Developers with Git knowledge</td>
        </tr>
      </table>
      
      <h3>SimplHost vs Vercel</h3>
      <table>
        <tr>
          <th>Feature</th>
          <th>SimplHost</th>
          <th>Vercel</th>
        </tr>
        <tr>
          <td>Deployment</td>
          <td>Upload ZIP file</td>
          <td>Git integration, CLI</td>
        </tr>
        <tr>
          <td>Learning Curve</td>
          <td>Zero</td>
          <td>Moderate</td>
        </tr>
        <tr>
          <td>Framework Support</td>
          <td>Static HTML, React, Vue</td>
          <td>Next.js, React, Vue, etc.</td>
        </tr>
        <tr>
          <td>Best For</td>
          <td>Simple sites, quick sharing</td>
          <td>Full-stack applications</td>
        </tr>
      </table>
      
      <h3>SimplHost vs GoDaddy/Hostinger</h3>
      <table>
        <tr>
          <th>Feature</th>
          <th>SimplHost</th>
          <th>Traditional Hosts</th>
        </tr>
        <tr>
          <td>Setup Complexity</td>
          <td>Upload and done</td>
          <td>cPanel, FTP, databases</td>
        </tr>
        <tr>
          <td>Cost</td>
          <td>Free tier available</td>
          <td>$5-15/month minimum</td>
        </tr>
        <tr>
          <td>File Management</td>
          <td>Simple ZIP upload</td>
          <td>FTP clients, file managers</td>
        </tr>
        <tr>
          <td>Best For</td>
          <td>Static sites, prototypes</td>
          <td>WordPress, PHP, databases</td>
        </tr>
      </table>
      
      <h3>Why Choose SimplHost?</h3>
      <ul>
        <li><strong>Zero Configuration:</strong> No build settings, environment variables, or deployment configs</li>
        <li><strong>No Git Required:</strong> Perfect for designers and non-developers</li>
        <li><strong>Instant Deployment:</strong> Live in seconds, not minutes</li>
        <li><strong>No Lock-in:</strong> Download your files anytime</li>
        <li><strong>Perfect for Prototypes:</strong> Share ideas quickly with clients</li>
      </ul>
      
      <p><strong>Bottom Line:</strong> If you need simplicity and speed, SimplHost wins. For complex applications with backends, consider Vercel or traditional hosting.</p>
    `
    },
    {
        id: 8,
        title: "Share Documentation, Images, PDFs & Links Effortlessly",
        date: "November 20, 2024",
        category: "Tips & Tricks",
        excerpt: "SimplHost isn't just for websites - share any web content quickly and professionally.",
        content: `
      <h2>Beyond Websites: Share Anything</h2>
      <p>SimplHost is versatile - here's how to share different types of content:</p>
      
      <h3>1. Documentation Sites</h3>
      <ul>
        <li>Create simple HTML documentation for your projects</li>
        <li>Share API documentation with developers</li>
        <li>Host user guides and tutorials</li>
        <li>Build internal knowledge bases</li>
      </ul>
      <p><strong>How:</strong> Create an index.html with links to different doc pages, ZIP it, and upload!</p>
      
      <h3>2. Image Galleries</h3>
      <ul>
        <li>Showcase photography portfolios</li>
        <li>Share event photos with attendees</li>
        <li>Create product image galleries</li>
        <li>Display design mockups</li>
      </ul>
      <p><strong>How:</strong> Use a simple HTML template with image tags, include images in ZIP, upload!</p>
      
      <h3>3. PDF Hosting</h3>
      <ul>
        <li>Share reports and whitepapers</li>
        <li>Distribute brochures and catalogs</li>
        <li>Host resumes and portfolios</li>
        <li>Provide downloadable resources</li>
      </ul>
      <p><strong>How:</strong> Create an HTML page with embedded PDF viewer or download links!</p>
      
      <h3>4. Link Collections</h3>
      <ul>
        <li>Create "link in bio" pages</li>
        <li>Organize resource lists</li>
        <li>Build bookmark collections</li>
        <li>Share curated content</li>
      </ul>
      <p><strong>How:</strong> Simple HTML with styled links - perfect for social media bios!</p>
      
      <h3>5. Interactive Presentations</h3>
      <ul>
        <li>Create web-based slideshows</li>
        <li>Share interactive demos</li>
        <li>Build clickable prototypes</li>
        <li>Present data visualizations</li>
      </ul>
      
      <h3>Quick Example: Link in Bio Page</h3>
      <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;My Links&lt;/title&gt;
  &lt;style&gt;
    body { font-family: Arial; text-align: center; padding: 50px; }
    a { display: block; margin: 20px auto; padding: 15px;
        background: #007bff; color: white; text-decoration: none;
        border-radius: 8px; max-width: 300px; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;My Links&lt;/h1&gt;
  &lt;a href="https://yoursite.com"&gt;Portfolio&lt;/a&gt;
  &lt;a href="https://github.com/you"&gt;GitHub&lt;/a&gt;
  &lt;a href="mailto:you@email.com"&gt;Email Me&lt;/a&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
      
      <p><strong>Pro Tip:</strong> SimplHost gives you a clean, professional URL to share instead of long file-sharing links!</p>
    `
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">SimplHost Blog</h1>
                    <p className="text-base text-blue-100">Tutorials, guides, and tips for effortless web hosting</p>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <article key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded-full">
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{article.date}</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary">
                                    <Link href={`#article-${article.id}`}>{article.title}</Link>
                                </h2>
                                <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                                <a
                                    href={`#article-${article.id}`}
                                    className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1"
                                >
                                    Read more →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Full Articles */}
                <div className="mt-16 space-y-16">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            id={`article-${article.id}`}
                            className="bg-white rounded-lg shadow-lg p-8 md:p-12 scroll-mt-8"
                        >
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-semibold text-primary bg-blue-50 px-4 py-1 rounded-full">
                                        {article.category}
                                    </span>
                                    <span className="text-sm text-gray-500">{article.date}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                            </div>

                            <div
                                className="prose prose-blue max-w-none article-content"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <a
                                    href="#top"
                                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                                >
                                    ↑ Back to top
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-primary text-white py-12 mt-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Deploy Your Project?</h2>
                    <p className="text-blue-100 mb-6">Join thousands of users hosting their web projects with SimplHost</p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </div>

            <style jsx>{`
        .article-content h2 {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .article-content p {
          color: #4b5563;
          line-height: 1.75;
          margin-bottom: 1rem;
        }
        
        .article-content ul, .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          color: #4b5563;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .article-content code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }
        
        .article-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .article-content pre code {
          background: transparent;
          color: #f9fafb;
          padding: 0;
        }
        
        .article-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .article-content th {
          background: #f3f4f6;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          border: 1px solid #e5e7eb;
        }
        
        .article-content td {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
        }
        
        .article-content strong {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
        </div>
    );
}
