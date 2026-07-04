import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAddClinicalNoteMutation } from '../../hooks/use-patients';
import { HeartPulse, Check } from 'lucide-react';

interface SymptomInputs {
  dyspnea: 'none' | 'mild' | 'moderate' | 'severe';
  fatigue: 'none' | 'mild' | 'moderate' | 'severe';
  chestPain: boolean;
  weightToday: string;
  generalNotes: string;
}

interface SymptomLogFormProps {
  patientId: string;
}

export const SymptomLogForm: React.FC<SymptomLogFormProps> = ({ patientId }) => {
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<SymptomInputs>({
    defaultValues: {
      dyspnea: 'none',
      fatigue: 'none',
      chestPain: false,
      weightToday: '',
      generalNotes: ''
    }
  });

  const [submitted, setSubmitted] = React.useState(false);
  const noteMutation = useAddClinicalNoteMutation();

  const onSubmit = async (data: SymptomInputs) => {
    // Compile note for simulated timeline save
    let compiledNote = `Patient symptoms self-reported. Weight: ${data.weightToday || 'not measured'} lbs. `;
    compiledNote += `Shortness of breath: ${data.dyspnea}. Fatigue: ${data.fatigue}. `;
    compiledNote += `Chest pain: ${data.chestPain ? 'YES' : 'NO'}. `;
    if (data.generalNotes) compiledNote += `Notes: ${data.generalNotes}`;

    await noteMutation.mutateAsync({
      patientId,
      noteText: compiledNote,
      provider: 'Patient Portal Self-Check'
    });

    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base font-semibold">
          <HeartPulse className="h-4.5 w-4.5 text-cyan-400" />
          <span>Daily Wellness Intake</span>
        </CardTitle>
        <CardDescription>
          Log symptoms and daily metrics to calibrate clinical predictions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-400 space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">Symptom Log Dispatch Successful</p>
            <p className="text-xs text-neutral-500">Your clinical care team has been synced.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Short of Breath */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Shortness of Breath (Dyspnea)
                </label>
                <select
                  {...register('dyspnea')}
                  className="w-full bg-black/40 border border-white/5 text-sm text-white rounded-xl p-2.5 outline-none hover:border-white/10 focus:border-cyan-500/30 transition-all duration-200"
                >
                  <option value="none">None (Breathing Normally)</option>
                  <option value="mild">Mild (With exertion)</option>
                  <option value="moderate">Moderate (Intermittent at rest)</option>
                  <option value="severe">Severe (Persistent distress)</option>
                </select>
              </div>

              {/* Fatigue */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Fatigue Level
                </label>
                <select
                  {...register('fatigue')}
                  className="w-full bg-black/40 border border-white/5 text-sm text-white rounded-xl p-2.5 outline-none hover:border-white/10 focus:border-cyan-500/30 transition-all duration-200"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild (Slight tiredness)</option>
                  <option value="moderate">Moderate (Limits heavy activities)</option>
                  <option value="severe">Severe (Debilitating exhaustion)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Weight */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Weight Today (lbs)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 164.2"
                  {...register('weightToday')}
                />
              </div>

              {/* Chest Pain Checkbox */}
              <div className="flex items-center space-x-3.5 border border-white/5 bg-black/20 rounded-xl px-4 py-2.5">
                <input
                  type="checkbox"
                  id="chestPain"
                  {...register('chestPain')}
                  className="h-4 w-4 rounded border-white/10 bg-black text-cyan-500 accent-cyan-500 outline-none cursor-pointer"
                />
                <label htmlFor="chestPain" className="text-sm font-semibold text-neutral-300 cursor-pointer">
                  Experiencing Chest Discomfort/Pain
                </label>
              </div>
            </div>

            {/* General Notes */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Symptom Notes / Physical Changes
              </label>
              <textarea
                placeholder="Log any other physical details (e.g. ankle swelling, dizziness)..."
                {...register('generalNotes')}
                className="w-full h-20 rounded-xl border border-white/5 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-neutral-500/80 outline-none backdrop-blur-md transition-all duration-200 focus:border-white/20 focus:bg-black/50"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="glow"
              disabled={isSubmitting}
              className="w-full cursor-pointer py-2.5"
            >
              {isSubmitting ? 'Syncing...' : 'Log Symptoms'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
