import React from "react";

export default function PatternsTab({ spacingScale }) {
  return (
    <div className="space-y-6 overflow-visible">
      <div className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Pattern Library
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Common UI patterns with proper spacing from your scale
        </p>

        {/* Navigation Bar Pattern */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Navigation Bar
          </h3>
          <div className="border-2 border-[var(--navBorder)] rounded-lg p-6 bg-background">
            <div
              className="bg-background rounded-lg shadow-sm"
              style={{
                padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center"
                  style={{ gap: `${spacingScale[6]?.value || 48}px` }}
                >
                  <div className="font-bold text-lg">Logo</div>
                  <nav
                    className="flex"
                    style={{ gap: `${spacingScale[4]?.value || 32}px` }}
                  >
                    <a href="#" className="text-slate-700 hover:text-blue-600">
                      Home
                    </a>
                    <a href="#" className="text-slate-700 hover:text-blue-600">
                      Products
                    </a>
                    <a href="#" className="text-slate-700 hover:text-blue-600">
                      About
                    </a>
                  </nav>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Sign In
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded text-xs text-slate-700">
              <code>
                padding: {spacingScale[2]?.name} {spacingScale[4]?.name} (
                {spacingScale[2]?.value}
                px {spacingScale[4]?.value}px) | gap: {spacingScale[6]?.name} &{" "}
                {spacingScale[4]?.name}
              </code>
            </div>
          </div>
        </div>

        {/* Card Grid Pattern */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Card Grid
          </h3>
          <div className="border-2 border-[var(--navBorder)] rounded-lg p-6 bg-background">
            <div
              className="grid grid-cols-3"
              style={{ gap: `${spacingScale[4]?.value || 32}px` }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)]"
                  style={{ padding: `${spacingScale[4]?.value || 32}px` }}
                >
                  <div className="w-full h-32 bg-slate-200 rounded mb-4"></div>
                  <h4 className="font-semibold mb-2">Card Title {i}</h4>
                  <p className="text-sm text-slate-600">
                    Card description with proper spacing applied.
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-background rounded text-xs text-slate-700">
              <code>
                grid gap: {spacingScale[4]?.name} ({spacingScale[4]?.value}px) |
                card padding: {spacingScale[4]?.name}
              </code>
            </div>
          </div>
        </div>

        {/* Form Pattern */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Form Layout
          </h3>
          <div className="border-2 border-[var(--navBorder)] rounded-lg p-6 bg-background">
            <div
              className="bg-background rounded-lg shadow-sm border border-[var(--navBorder)] max-w-md"
              style={{ padding: `${spacingScale[6]?.value || 48}px` }}
            >
              <h3 className="text-xl font-semibold mb-1">Sign Up</h3>
              <p
                className="text-sm text-slate-600"
                style={{ marginBottom: `${spacingScale[5]?.value || 40}px` }}
              >
                Create your account
              </p>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    style={{ marginBottom: `${spacingScale[1]?.value || 8}px` }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg"
                    style={{ padding: `${spacingScale[2]?.value || 16}px` }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700"
                    style={{ marginBottom: `${spacingScale[1]?.value || 8}px` }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-[var(--navBorder)] rounded-lg"
                    style={{ padding: `${spacingScale[2]?.value || 16}px` }}
                  />
                </div>
                <button
                  className="w-full bg-blue-600 text-white rounded-lg"
                  style={{
                    padding: `${spacingScale[2]?.value || 16}px`,
                    marginTop: `${spacingScale[3]?.value || 24}px`,
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded text-xs text-slate-700">
              <code>
                container padding: {spacingScale[6]?.name} | field spacing:{" "}
                {spacingScale[1]?.name} | button margin-top:{" "}
                {spacingScale[3]?.name}
              </code>
            </div>
          </div>
        </div>

        {/* Hero Section Pattern */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Hero Section
          </h3>
          <div className="border-2 border-[var(--navBorder)] rounded-lg p-6 bg-background">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center"
              style={{
                padding: `${spacingScale[8]?.value || 64}px ${spacingScale[4]?.value || 32}px`,
              }}
            >
              <h1
                className="text-4xl font-bold"
                style={{ marginBottom: `${spacingScale[3]?.value || 24}px` }}
              >
                Welcome to Our Product
              </h1>
              <p
                className="text-lg opacity-90"
                style={{ marginBottom: `${spacingScale[5]?.value || 40}px` }}
              >
                Build amazing things with our spacing system
              </p>
              <div
                className="flex justify-center"
                style={{ gap: `${spacingScale[3]?.value || 24}px` }}
              >
                <button
                  className="bg-background text-blue-600 font-semibold rounded-lg"
                  style={{
                    padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
                  }}
                >
                  Get Started
                </button>
                <button
                  className="border-2 border-white text-white font-semibold rounded-lg"
                  style={{
                    padding: `${spacingScale[2]?.value || 16}px ${spacingScale[4]?.value || 32}px`,
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded text-xs text-slate-700">
              <code>
                padding: {spacingScale[8]?.name} {spacingScale[4]?.name} |
                heading margin: {spacingScale[3]?.name} | button gap:{" "}
                {spacingScale[3]?.name}
              </code>
            </div>
          </div>
        </div>

        {/* Feature List Pattern */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Feature List
          </h3>
          <div className="border-2 border-[var(--navBorder)] rounded-lg p-6 bg-background">
            <div className="bg-background rounded-lg">
              <div
                className="grid grid-cols-2"
                style={{
                  gap: `${spacingScale[5]?.value || 40}px`,
                  padding: `${spacingScale[5]?.value || 40}px`,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div
                      className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold"
                      style={{
                        marginBottom: `${spacingScale[3]?.value || 24}px`,
                      }}
                    >
                      {i}
                    </div>
                    <h4 className="font-semibold mb-2">Feature {i}</h4>
                    <p className="text-sm text-slate-600">
                      Description of this amazing feature with proper spacing.
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-background rounded text-xs text-slate-700">
              <code>
                grid gap: {spacingScale[5]?.name} | icon margin-bottom:{" "}
                {spacingScale[3]?.name}
              </code>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-green-800">
            These patterns use spacing tokens from your generated scale. Copy
            the code snippets and adjust the spacing values to match your design
            needs. All spacing values are responsive to your scale changes!
          </p>
        </div>
      </div>
    </div>
  );
}
