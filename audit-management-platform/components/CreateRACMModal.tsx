
import React, { useState, useEffect, useMemo } from 'react';
import type { RACM } from '../types';
import { UploadIcon, CloseIcon, ChevronDownIcon } from './icons/Icons';

type FormData = Omit<RACM, 'id' | 'version' | 'status' | 'locked' | 'linkedEngagements' | 'lastUpdated'> & { description?: string };

interface CreateRACMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  existingRacms: RACM[];
}

const INITIAL_FORM_STATE: FormData = {
  name: '',
  owner: '',
  framework: '',
  financialYear: '',
  description: ''
};

const RACM_OWNERS = ["Aarav Mehta", "Riya Sharma", "Kabir Shah", "Neha Patel"];
const FRAMEWORK_TYPES = ["SOX", "Internal", "IFC"];
const FINANCIAL_YEARS = ["FY 2025", "FY 2026", "FY 2027"];

const CreateRACMModal: React.FC<CreateRACMModalProps> = ({ isOpen, onClose, onSubmit, existingRacms }) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setIsDirty(false);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'RACM Name is required.';
    } else if (formData.name.length < 3) {
      newErrors.name = 'RACM Name must be at least 3 characters.';
    } else if (existingRacms.some(r => r.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'RACM with this name already exists.';
    }

    // Owner validation
    if (!formData.owner) newErrors.owner = 'RACM Owner is required.';

    // Framework validation
    if (!formData.framework) newErrors.framework = 'Framework Type is required.';
    
    // Financial Year validation
    if (!formData.financialYear) newErrors.financialYear = 'Financial Year is required.';

    // Duplicate configuration check
    if (!newErrors.name && !newErrors.framework && !newErrors.financialYear) {
      if (existingRacms.some(r => 
          r.name.toLowerCase() === formData.name.toLowerCase() &&
          r.framework === formData.framework &&
          r.financialYear === formData.financialYear
      )) {
        newErrors.form = 'Duplicate RACM configuration detected.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Re-validate whenever form data changes
  useEffect(() => {
      if (isDirty) {
          validate();
      }
  }, [formData, existingRacms, isDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsDirty(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm("Discard unsaved changes?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;
  
  const isFormValid = Object.keys(errors).length === 0 && isDirty;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <UploadIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Create RACM</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Version</label>
              <p className="mt-1 text-base font-semibold text-gray-800">V 1.0</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  RACM Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                  RACM Owner<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10 ${errors.owner ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled>Select an owner</option>
                    {RACM_OWNERS.map(owner => <option key={owner} value={owner}>{owner}</option>)}
                  </select>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"/>
                </div>
                {errors.owner && <p className="mt-1 text-xs text-red-600">{errors.owner}</p>}
              </div>

              <div>
                <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-1">
                  Framework Type<span className="text-red-500">*</span>
                </label>
                 <select
                    id="framework"
                    name="framework"
                    value={formData.framework}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10 ${errors.framework ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled>Select a framework</option>
                    {FRAMEWORK_TYPES.map(fw => <option key={fw} value={fw}>{fw}</option>)}
                  </select>
                {errors.framework && <p className="mt-1 text-xs text-red-600">{errors.framework}</p>}
              </div>

              <div>
                <label htmlFor="financialYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Year<span className="text-red-500">*</span>
                </label>
                 <select
                    id="financialYear"
                    name="financialYear"
                    value={formData.financialYear}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10 ${errors.financialYear ? 'border-red-500' : ''}`}
                  >
                    <option value="" disabled>Select a year</option>
                    {FINANCIAL_YEARS.map(fy => <option key={fy} value={fy}>{fy}</option>)}
                  </select>
                {errors.financialYear && <p className="mt-1 text-xs text-red-600">{errors.financialYear}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                RACM Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            {errors.form && <p className="mt-1 text-sm text-red-600 text-center">{errors.form}</p>}
          </div>
        </form>
        
        <footer className="px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-3">
          <button type="button" onClick={onClose} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CreateRACMModal;
