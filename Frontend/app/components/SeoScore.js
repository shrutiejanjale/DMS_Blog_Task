'use client';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function SeoScore({ blog }) {
  let score = 0;
  const checks = [];

  // Meta Title Check
  if (blog?.metaTitle?.trim()) {
    score += 20;
    checks.push({ 
      label: 'Meta Title', 
      passed: true, 
      message: 'Meta title is present' 
    });
  } else {
    checks.push({ 
      label: 'Meta Title', 
      passed: false, 
      message: 'Meta title is missing' 
    });
  }

  // Meta Description Check
  if (blog?.metaDescription?.trim()) {
    score += 20;
    checks.push({ 
      label: 'Meta Description', 
      passed: true, 
      message: 'Meta description is present' 
    });
  } else {
    checks.push({ 
      label: 'Meta Description', 
      passed: false, 
      message: 'Meta description is missing' 
    });
  }

  // SEO Keywords Check
  if (Array.isArray(blog?.seoKeywords) && blog.seoKeywords.length > 0) {
    score += 20;
    checks.push({ 
      label: 'SEO Keywords', 
      passed: true, 
      message: `${blog.seoKeywords.length} keyword(s) added` 
    });
  } else {
    checks.push({ 
      label: 'SEO Keywords', 
      passed: false, 
      message: 'No SEO keywords added' 
    });
  }

  // Word Count Check
  let wordCount = 0;
  if (typeof blog?.content === 'string' && blog.content.trim()) {
    wordCount = blog.content.split(/\s+/).filter(Boolean).length;
    if (wordCount > 300) {
      score += 20;
      checks.push({ 
        label: 'Content Length', 
        passed: true, 
        message: `${wordCount} words (recommended: 300+)` 
      });
    } else {
      checks.push({ 
        label: 'Content Length', 
        passed: false, 
        message: `${wordCount} words (recommended: 300+)` 
      });
    }
  } else {
    checks.push({ 
      label: 'Content Length', 
      passed: false, 
      message: 'No content added' 
    });
  }

  // Featured Image Check
  if (blog?.featuredImage?.trim()) {
    score += 20;
    checks.push({ 
      label: 'Featured Image', 
      passed: true, 
      message: 'Featured image is present' 
    });
  } else {
    checks.push({ 
      label: 'Featured Image', 
      passed: false, 
      message: 'Featured image is missing' 
    });
  }

  // Determine score color and status
  const getScoreStatus = () => {
    if (score >= 80) return { 
      color: 'green', 
      label: 'Excellent', 
      bgGradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    };
    if (score >= 60) return { 
      color: 'blue', 
      label: 'Good', 
      bgGradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    };
    if (score >= 40) return { 
      color: 'yellow', 
      label: 'Fair', 
      bgGradient: 'from-yellow-500 to-amber-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    };
    return { 
      color: 'red', 
      label: 'Needs Improvement', 
      bgGradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    };
  };

  const status = getScoreStatus();

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className={`bg-gradient-to-r ${status.bgGradient} rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Overall SEO Score</h3>
            <p className="text-white/90 text-sm">{status.label}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{score}</div>
            <div className="text-xl font-medium">/100</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* SEO Checklist */}
      <div className={`${status.bgLight} rounded-xl p-6 border-2 ${status.borderColor}`}>
        <h4 className="font-semibold text-slate-800 mb-4 text-lg">SEO Checklist</h4>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                check.passed ? 'bg-white border border-green-200' : 'bg-white border border-slate-200'
              }`}
            >
              {check.passed ? (
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <XCircle className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
              )}
              <div className="flex-1">
                <p className={`font-medium ${check.passed ? 'text-slate-800' : 'text-slate-600'}`}>
                  {check.label}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {score < 100 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                {!blog?.metaTitle?.trim() && <li>Add a compelling meta title (50-60 characters)</li>}
                {!blog?.metaDescription?.trim() && <li>Write a meta description (150-160 characters)</li>}
                {(!Array.isArray(blog?.seoKeywords) || blog.seoKeywords.length === 0) && <li>Include 3-5 relevant SEO keywords</li>}
                {wordCount <= 300 && <li>Increase content length to at least 300 words</li>}
                {!blog?.featuredImage?.trim() && <li>Upload an eye-catching featured image</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Perfect Score Message */}
      {score === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Perfect SEO Score! 🎉</h4>
              <p className="text-sm text-green-800">
                Your blog post is fully optimized for search engines. Great job!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}