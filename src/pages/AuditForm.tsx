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

        if (data.services.includes('web')) {
            total += PRICING.WEB_APP.base + (data.pages * PRICING.WEB_APP.perPage);
        }

        if (data.services.includes('ios') || data.services.includes('android')) {
            total += PRICING.MOBILE_APP.base * PRICING.MOBILE_APP.platformMultiplier;
        }

        if (data.seo) {
            total += PRICING.SEO;
        }

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
    )
}