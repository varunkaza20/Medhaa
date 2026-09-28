import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { SentimentPage } from './pages/Sentiment';
import { NERPage } from './pages/NER';
import { TransliterationPage } from './pages/Transliteration';
import { CodeSwitchingPage } from './pages/CodeSwitching';
import { AnalyzePage } from './pages/Analyze';
import { ModelsPage } from './pages/Models';
import { AboutPage } from './pages/About';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sentiment" element={<SentimentPage />} />
          <Route path="ner" element={<NERPage />} />
          <Route path="transliteration" element={<TransliterationPage />} />
          <Route path="code-switch" element={<CodeSwitchingPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
