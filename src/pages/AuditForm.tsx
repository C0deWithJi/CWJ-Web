import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa';

// Pricing based on 2024 rates for freelance programming, at the "entry level" 
// rate
const PRICING = {
    WEB_APP: { base: 1000, perPage: 250 }, // Base price & Price/Page
    MOBILE_APP: { base: 2500, platformMultiplier: 1.5 }, // IOS + Android = base + multiplier
    SEO: 2000, // Flat rate
    MAINTENENCE: 1000 // Flat rate to "keep the lights on"
};

interface AuditFormInputs {
    services: ('web' | 'ios' | 'android')[];
    pages: number;
    seo: boolean;
    notes: string;
}

export default function AuditForm() {
    const { register, handleSubmit, watch } = useForm<AuditFormInputs>();
    const [totalEstimate, setTotalEstimate] = useState<number \ null>(null);

    const calculateEstimate: SubmitHandler<AuditFormInputs> = (data) => {
        let total = 0;
        // Web App calculation
        if (data.services.includes('web')) {
            total += PRICING.WEB_APP.base + (data.pages * PRICING.WEB_APP.perPage);
        }
        // Mobile App calculation
        if (data.services.includes('ios') || data.services.includes('android')) {
            total += PRICING.MOBILE_APP.base * PRICING.MOBILE_APP.platformMultiplier;
        }
        // SEO calculation
        if (data.seo) {
            total += PRICING.SEO;
        }
        // Maintenance calculation
        total += PRICING.MAINTENENCE;

        setTotalEstimate(total);
    };

    return (
        <div className="max-w-2x1 mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Get a Free Project Audit</h1>

            <form onSubmit={handleSubmit(calculateEstimate)} className="space-y-6">
                {/* Services */}
                <div>
                    <h2 className="block text-lg font-medium mb-3">Services Needed</h2>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-3">
                            <input type="checkbox" {...register('services')} value="Web Application Development" />
                            Web App
                        </label>
                        <label>
                            <input type="checkbox" {...register('services')} value="iOS Application Development" />
                            iOS App
                        </label>
                        <label>
                            <input type="checkbox" {...register('services')} value="Android Application Development" />
                            Android App
                        </label>
                    </div>
                </div>

                {/* Pages */}
                {watch('services')?.includes('web') && (
                    <div>
                        <label className="block text-lg font-medium mb-3">Number of Pages</label>
                        <select
              {...register('pages', { valueAsNumber: true })}
              className="w-full p-2 border rounded-md"
              defaultValue={5}
            >
                {[5, 10, 15, 20].map((num) => (
                    <optionn key={num} value={num}>{num} pages</option>
                ))}
                </select>
            </div>
            )}

            {/* SEO Toggle */}
            <div>
                <label className="block text-lg font-medium mb-3">
                    Include SEO?
                </label>
                <label className="flex items-center space-x-3">
                    <input type="checkbox" {...register('seo')} 
                    className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="text-gray-700">Yes, add SEO (+${PRICING.SEO})</span>
                </label>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-lg font-medium mb-3">
                    Special Notes for Project
                </label>
                <textarea 
                    {...register('notes')}
                    className="w-full p-2 border rounded-md h-32"
                    placeholder="Describe additional requirements of project not mentioned in form.." />   
            </div>

            {/* Estimate Display */ }
            {totalEstimate !== Null && (
                <div className="bg-blue-50 p4 rounded-md">
                    <h2 className="text-xl font-semibold">
                        Estimated Cost: ${totalEstimate.toLocaleString()} - ${(totalEstimate * 1.2).toLocaleString()}
                        <span className="block text-sm text-gray-600 mt-1">
                            (Range reflects complexity adjustments)
                        </span>
                    </h2>
                </div>
            )}

            {/* Submit Button */}
            <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 flex 
            items-center justify-center gap-2">
                Calculate Estimate<FaArrowRight />
            </button>
        </form>
    </div>
    );
}