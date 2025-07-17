"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { useAdminSettings } from "@/components/admin-settings-provider";
import { createClient } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const steps = [
  {
    title: "Welcome & Prerequisites",
    description: "Learn how to launch your own live application in just a few steps and use AI to modify it to your needs."
  },
  {
    title: "Fork the Repository",
    description: "Fork the official GitHub repository to your own account."
  },
  {
    title: "Set Up Supabase Database",
    description: "Create a new Supabase project and set up all required tables, policies, functions, and triggers."
  },
  {
    title: "Deploy to Vercel",
    description: "Deploy your forked repository to Vercel with a single click."
  },
  {
    title: "Local Development Setup",
    description: "Clone your forked repository, set up environment variables, and install dependencies."
  },
  {
    title: "Join Our Community",
    description: "Subscribe to our YouTube channel and join our Skool community to level up your AI & Software Development journey."
  }
];

export default function DeployGuidePage() {
  const [currentStep, setCurrentStep] = useState(0);
  // const missing = missingEnvVars();
  // Remove fallback: always render the normal stepper
  const { theme } = useTheme();
  const { adminSettings } = useAdminSettings();
  // Remove adminSettings.repo usage for repo URL
  const [checkingRepo, setCheckingRepo] = useState(false);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlScript, setSqlScript] = useState<string | null>(null);

  // Always fetch repo from Supabase
  useEffect(() => {
    setCheckingRepo(true);
    (async () => {
      try {
        const supabase = createClient();
        if (!supabase) return;
        const { data, error } = await supabase
          .from("admin_settings")
          .select("repo")
          .limit(1)
          .maybeSingle();
        setRepoUrl(data?.repo ?? null);
      } finally {
        setCheckingRepo(false);
      }
    })();
  }, []);

  // Handler to open modal and load SQL
  const handleOpenSqlModal = async () => {
    // Dynamically import the SQL file (client-side safe)
    const res = await fetch("/supabase.sql");
    const text = await res.text();
    setSqlScript(text);
    setShowSqlModal(true);
  };

  // Dynamic theme-aware colors from adminSettings
  const isDark = theme === "dark";
  const cardBg = isDark
    ? adminSettings?.dark_header_background_color || "#18181b"
    : adminSettings?.header_background_color || "#fff";
  const cardText = isDark
    ? adminSettings?.dark_paragraph_text_color || adminSettings?.dark_button_text_color || "#fff"
    : adminSettings?.paragraph_text_color || adminSettings?.button_text_color || "#18181b";
  const cardBorder = isDark
    ? adminSettings?.dark_button_color || "#27272a"
    : adminSettings?.button_color || "#e5e7eb";

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // Helper for step 1 content
  function StepWelcome() {
    return (
      <div
        className="w-full flex flex-col items-center gap-6"
        style={{
          backgroundColor: isDark
            ? adminSettings?.dark_background_color || "#18181b"
            : adminSettings?.background_color || "#fff",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <div className="w-full text-left" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">To follow along with this guide, you will need:</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>Free Supabase Account <span className="font-mono">(required)</span></li>
            <li>Free GitHub Account <span className="font-mono">(required)</span></li>
            <li>Vercel Account <span className="font-mono">(free trial: recommended if you want to host a live web application)</span></li>
            <li>IDE Code Editor <span className="font-mono">(required to make changes to the application, Cursor Recommended)</span></li>
          </ol>
        </div>
      </div>
    );
  }

  function StepForkRepo() {
    if (checkingRepo) {
      return <span className="text-sm text-muted-foreground">Checking repository URL...</span>;
    }
    if (!repoUrl) {
      return (
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-sm text-red-500 font-medium">Repository URL is not set.</span>
          <span className="text-xs text-muted-foreground">Please set the repository URL in the Admin Settings page.</span>
        </div>
      );
    }
    return (
      <div
        className="flex flex-col items-center gap-3 w-full"
        style={{
          backgroundColor: isDark
            ? adminSettings?.dark_background_color || "#18181b"
            : adminSettings?.background_color || "#fff",
          border: "1px solid #d8d8d8",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <span className="text-sm break-all" style={{ color: cardText }}>
          Repository: <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary" style={{ color: cardText }}>{repoUrl}</a>
        </span>
        <a
          href={`${repoUrl}/fork`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="default">Fork this Repository on GitHub</Button>
        </a>
      </div>
    );
  }

  function StepSupabaseSetup() {
    return (
      <div
        className="w-full flex flex-col items-center gap-6"
        style={{
          backgroundColor: isDark
            ? adminSettings?.dark_background_color || "#18181b"
            : adminSettings?.background_color || "#fff",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <div className="w-full text-center mb-2" style={{ color: cardText }}>
          <div className="text-base font-semibold" style={{ marginBottom: 0, textAlign: 'left' }}>
            Create a new Supabase project and set up all required tables, policies, functions, and triggers. You can create a <b>Free Supabase Account</b> if you do not already have one by clicking the link below.
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full justify-center">
          <a
            href="https://database.new/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/2"
          >
            <Button className="w-full" variant="default">Create Supabase Project</Button>
          </a>
          <Button className="w-1/2" variant="outline" onClick={handleOpenSqlModal}>
            Copy SQL
          </Button>
        </div>
        <div className="w-full mt-4 text-left" style={{ color: cardText, fontSize: '80%' }}>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Click <b>Create Supabase Project</b> and follow the prompts to create a new project in your Supabase account.</li>
            <li>After your project is created, go to the <b>SQL Editor</b> in the Supabase dashboard.</li>
            <li>Click <b>Copy SQL</b> and paste the script into the SQL editor, then run it to set up all tables, policies, functions, and triggers.</li>
            <li>Do <b>not</b> run this script if you already have a working database.</li>
          </ol>
        </div>
        <Dialog open={showSqlModal} onOpenChange={setShowSqlModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Supabase SQL Setup Script</DialogTitle>
              <DialogDescription>
                Copy and paste this script into the SQL editor of your new Supabase project.
              </DialogDescription>
            </DialogHeader>
            <pre className="bg-muted p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap" style={{ maxHeight: 400 }}>&quot;{sqlScript}&quot;</pre>
            <div className="flex justify-end mt-2">
              <Button
                variant="default"
                onClick={() => {
                  if (sqlScript) navigator.clipboard.writeText(sqlScript);
                }}
              >
                Copy to Clipboard
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="ml-2">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function StepVercelDeploy() {
    return (
      <div
        className="w-full flex flex-col items-center gap-6"
        style={{
          backgroundColor: isDark
            ? adminSettings?.dark_background_color || "#18181b"
            : adminSettings?.background_color || "#fff",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <div className="w-full text-center mb-2" style={{ color: cardText }}>
          <div className="text-base" style={{ marginBottom: 0, textAlign: 'left', fontWeight: 400 }}>
            Click the Deploy to Vercel button below. Click the Import button next to the GitHub Repo you forked. If you do not already have a Vercel account you can <b><a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer">Create an Account</a></b> and then come back to this page.
          </div>
        </div>
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button className="w-full" variant="default">Deploy to Vercel</Button>
        </a>
        <div className="w-full mt-4 text-left" style={{ color: cardText, fontSize: '90%' }}>
          <div className="mb-2 font-semibold">Required Environment Variables:</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border rounded" style={{ borderColor: cardBorder }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? adminSettings?.dark_button_color || '#23272f' : adminSettings?.button_color || '#f3f4f6', color: cardText }}>
                  <th className="px-2 py-1 text-left">Variable</th>
                  <th className="px-2 py-1 text-left">Where to Find / Set</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 font-mono">NEXT_PUBLIC_SUPABASE_URL</td>
                  <td className="px-2 py-1">Settings → API → Project URL (Supabase)</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</td>
                  <td className="px-2 py-1">Settings → API → anon public key (Supabase)</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-mono">NEXT_PUBLIC_STRIPE_KEY</td>
                  <td className="px-2 py-1">Get from your Stripe Dashboard</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-mono">NEXT_PUBLIC_STRIPE_SECRET</td>
                  <td className="px-2 py-1">Get from your Stripe Dashboard</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-1">How to get these values:</div>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Go to your <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="underline">Supabase dashboard</a> and select your project.</li>
              <li>Click <b>Project Settings</b> → <b>Data API</b> in the sidebar.</li>
              <li>Copy the <b>Project URL</b> for <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span>.</li>
              <li>Click <b>API Keys</b> link in the sidebar.</li>
              <li>Copy the <b>anon public</b> key for <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>.</li>
            </ol>
          </div>
        </div>
        {/* Admin User Setup Instructions */}
        <div className="w-full mt-8 text-left p-4 rounded bg-muted" style={{ color: cardText, fontSize: '95%' }}>
          <div className="text-base font-semibold mb-2">Create an Admin User</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm">
            <li>When your application has been launched, click on the <b>Get Started</b> button and register a user.</li>
            <li>This user will be automatically inserted into the <span className="font-mono">user_data</span> table.</li>
            <li>Change the <span className="font-mono">user_role</span> column value to <b>admin</b> for this user (in Supabase dashboard or SQL).</li>
          </ol>
          <div className="mt-2 text-sm">Now this user will have full admin privileges.</div>
        </div>
      </div>
    );
  }

  function StepLocalDevSetup() {
    // const repoUrl = adminSettings?.repo || repoBackup || 'https://github.com/your-username/your-forked-repo';
    return (
      <div
        className="w-full flex flex-col items-center gap-6"
        style={{
          backgroundColor: isDark
            ? adminSettings?.dark_background_color || "#18181b"
            : adminSettings?.background_color || "#fff",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <div className="w-full text-left mb-2" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">Recommended IDE</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>
              Download and install <a href="https://cursor.com/en" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Cursor IDE</a> (recommended).
            </li>
            <li>
              Alternatively, you can use other AI code IDEs such as Visual Studio Code or Windsurf. If using VS Code, we recommend the <span className="font-semibold">Cline Code</span> or <span className="font-semibold">RooCode</span> extensions for AI development. This application is integrated with VS Code and Windsurf but optimized for Cursor.
            </li>
          </ol>
        </div>
        <div className="mb-4 p-2 rounded bg-muted text-xs" style={{ color: cardText }}>
          <b>Tip for Cursor Users:</b><br />
          If you are using Cursor, you can provide the below instructions in agent mode and the Cursor agent will run these steps for you automatically.
        </div>
        <div className="w-full text-left" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">Clone Your Forked Repository</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>
              Create a new folder for your project and open it in Cursor
            </li>
            <li>
              Clone your forked repo into the project folder (replace with your fork, not the original repo):<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">{'git clone https://github.com/{your-forked-repo} .'}</span>
            </li>
            <li>
              Set the folder as a git repository (if not already):<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">git init</span>
            </li>
            <li>
              Add your forked repo as the origin:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">{'git remote add origin https://github.com/{your-forked-repo}.git'}</span>
            </li>
            <li>
              To push changes and trigger a rebuild on Vercel, use:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">git add .<br />git commit -m &quot;Your commit message&quot;<br />git push origin main</span>
            </li>
          </ol>
        </div>
        <div className="w-full text-left" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">Create a <span className="font-mono">.env</span> and <span className="font-mono">.env.local</span> File</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>
              In the root of your project, create a file named <span className="font-mono">.env.local</span>.
            </li>
            <li>
              Add the following environment variables (copy from your Supabase dashboard as described in the previous step, and set your Stripe keys as provided by Stripe):
              <pre className="bg-muted p-2 rounded text-xs mt-2 mb-2"><code>{`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key\nNEXT_PUBLIC_STRIPE_KEY=your-stripe-key\nNEXT_PUBLIC_STRIPE_SECRET=your-stripe-secret`}</code></pre>
            </li>
          </ol>
        </div>
        <div className="w-full text-left" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">Install Dependencies</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>
              In your project directory, run:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">npm install</span>
            </li>
          </ol>
        </div>
        <div className="w-full text-left" style={{ color: cardText }}>
          <div className="text-base font-semibold mb-2">Run the Application</div>
          <ol className="list-decimal ml-6 space-y-2 text-sm" style={{ fontWeight: 400 }}>
            <li>
              To start the development server, run:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">pnpm dev</span>
            </li>
            <li>
              To build the application for production, run:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">pnpm build</span>
            </li>
            <li>
              To start the production server, run:<br />
              <span className="font-mono bg-muted px-2 py-1 rounded block mt-1 mb-1">pnpm start</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  function StepCommunity() {
    // Page background color for light mode
    const pageBackground = isDark 
      ? "transparent" 
      : adminSettings?.header_background_color || "#fff";
    
    return (
      <div className="w-full flex flex-col items-center gap-6" style={{ 
        padding: "16px", 
        borderRadius: "8px",
        backgroundColor: pageBackground
      }}>
        <div className="w-full text-left" style={{ 
          color: cardText,
          backgroundColor: pageBackground,
          padding: "16px",
          borderRadius: "8px"
        }}>
          <div className="text-base font-semibold mb-4">Level Up Your AI & Software Journey</div>
          <div className="space-y-4">
            <div className="text-sm">
              <p className="mb-2">Subscribe to our YouTube channel to learn more about Software Development and AI Vibe Coding:</p>
              <Button
                onClick={() => window.open("https://www.youtube.com/@GeagAI", "_blank", "noopener,noreferrer")}
                className="w-full"
                style={{
                  backgroundColor: isDark 
                    ? adminSettings?.dark_button_color || "#23272f"
                    : adminSettings?.button_color || "#f3f4f6",
                  color: isDark 
                    ? adminSettings?.dark_button_text_color || "#fff"
                    : adminSettings?.button_text_color || "#18181b",
                  borderColor: isDark 
                    ? adminSettings?.dark_button_color || "#23272f"
                    : adminSettings?.button_color || "#f3f4f6"
                }}
              >
                Subscribe on YouTube
              </Button>
            </div>
            <div className="text-sm">
              <p className="mb-2">Join our Skool Community to get daily business startup ideas and learn more about AI Software Development:</p>
              <Button
                onClick={() => window.open("https://www.skool.com/daily-business-startup-ideas-4055/about", "_blank", "noopener,noreferrer")}
                className="w-full"
                style={{
                  backgroundColor: isDark 
                    ? adminSettings?.dark_button_color || "#23272f"
                    : adminSettings?.button_color || "#f3f4f6",
                  color: isDark 
                    ? adminSettings?.dark_button_text_color || "#fff"
                    : adminSettings?.button_text_color || "#18181b",
                  borderColor: isDark 
                    ? adminSettings?.dark_button_color || "#23272f"
                    : adminSettings?.button_color || "#f3f4f6"
                }}
              >
                Join the Community
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-4" style={{ 
          backgroundColor: pageBackground,
          padding: "16px",
          borderRadius: "8px"
        }}>
          <div style={{ width: '100%', maxWidth: 560 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
              <iframe
                src="https://www.youtube.com/embed/2ESZJyLUBVE?si=oYYIOmgMwwTFmTNp"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add StepCommunity to the stepComponents array as the last step
  const stepComponents = [
    StepWelcome,
    StepForkRepo,
    StepSupabaseSetup,
    StepVercelDeploy,
    StepLocalDevSetup,
    StepCommunity,
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <Card
        className="w-full max-w-xl p-8 shadow-lg"
        style={{
          backgroundColor: cardBg,
          color: cardText,
          borderColor: cardBorder,
          borderWidth: 1,
          borderStyle: "solid"
        }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Deploy Your Application</h1>
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-2"
            style={{
              backgroundColor: isDark
                ? adminSettings?.dark_button_hover_color || "#27272a"
                : adminSettings?.button_hover_color || "#e5e7eb"
            }}
          />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground mb-4">{steps[currentStep].description}</p>
          {/* Step-specific content should also use theme colors from adminSettings */}
          <div
            className="min-h-[80px] flex items-center justify-center rounded-md"
            style={{
              backgroundColor: isDark
                ? adminSettings?.dark_button_hover_color || "#23272f"
                : adminSettings?.button_hover_color || "#f3f4f6",
              color: cardText
            }}
          >
            {stepComponents[currentStep]()}
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
} 