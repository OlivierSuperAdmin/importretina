import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormField {
  type: 'text' | 'email' | 'tel' | 'select';
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  validation?: {
    regex: string;
    message: string;
  };
}

interface FormStep {
  title: string;
  track?: string;
  fields: FormField[];
  primaryCta: {
    label: string;
    track?: string;
  };
}

interface MultiStepFormProps {
  title: string;
  description: string;
  steps: FormStep[];
  submitUrl: string;
  method: string;
  success: {
    title: string;
    text: string;
    track?: string;
  };
  privacyNote: string;
  style?: {
    fieldRadius?: number;
    buttonFullWidth?: boolean;
  };
}

export default function MultiStepForm({ 
  title, 
  description, 
  steps, 
  submitUrl,
  success,
  privacyNote,
  style = {}
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const stepFields = steps[currentStep].fields;
    const newErrors: Record<string, string> = {};

    stepFields.forEach(field => {
      const value = formData[field.name] || '';
      
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} est requis`;
      } else if (field.validation && value) {
        const regex = new RegExp(field.validation.regex);
        if (!regex.test(value)) {
          newErrors[field.name] = field.validation.message;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function handleSubmit() {
    try {
      // In a real implementation, you would submit to the webhook
      console.log('Submitting form data:', formData);
      console.log('Submit URL:', submitUrl);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (success.track) {
        console.log(`Track event: ${success.track}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-8" id="form">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {success.title}
              </h2>
              
              <p className="text-gray-600 text-sm">
                {success.text}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8" id="form">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-600">
              {description}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {steps[currentStep].title}
            </h3>

            <div className="space-y-4">
              {steps[currentStep].fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="form-select"
                      style={{ borderRadius: `${style.fieldRadius || 10}px` }}
                    >
                      <option value="">Sélectionnez...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="form-input"
                      style={{ borderRadius: `${style.fieldRadius || 10}px` }}
                    />
                  )}
                  
                  {field.help && (
                    <p className="text-sm text-gray-500 mt-1">
                      {field.help}
                    </p>
                  )}
                  
                  {errors[field.name] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Form navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <button
                onClick={handleNext}
                className={`flex items-center space-x-2 btn-primary ${
                  style.buttonFullWidth ? 'flex-1 justify-center ml-4' : ''
                }`}
              >
                <span>
                  {currentStep === steps.length - 1 
                    ? steps[currentStep].primaryCta.label 
                    : 'Continuer'
                  }
                </span>
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {privacyNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}