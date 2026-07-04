import React, { useState } from 'react';
import { Dialog } from '../../components/ui/dialog';
import { Patient } from '../../types';
import { useForm } from 'react-hook-form';
import { useAddClinicalNoteMutation } from '../../hooks/use-patients';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Activity, Plus, Check } from 'lucide-react';

interface ClinicalNoteInputs {
  clinicalNote: string;
}

interface ClinicalActionCenterProps {
  patient: Patient;
}

export const ClinicalActionCenter: React.FC<ClinicalActionCenterProps> = ({ patient }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ClinicalNoteInputs>({
    defaultValues: { clinicalNote: '' }
  });

  const [noted, setNoted] = React.useState(false);
  const noteMutation = useAddClinicalNoteMutation();

  const onSubmitNote = async (data: ClinicalNoteInputs) => {
    if (!data.clinicalNote.trim()) return;
    await noteMutation.mutateAsync({
      patientId: patient.id,
      noteText: data.clinicalNote,
      provider: 'Dr. Evelyn Vance (Ward Lead)'
    });
    setNoted(true);
    reset();
    setTimeout(() => setNoted(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center space-x-2 text-[#4E3629]">
          <Activity className="h-4.5 w-4.5 text-[#C7A37E]" />
          <span>Clinical Intake Command Center</span>
        </CardTitle>
        <CardDescription>
          Record diagnostic findings, add clinical directives, or execute triage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Note input form */}
        <form onSubmit={handleSubmit(onSubmitNote)} className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/60 block text-left">
            Clinical Directive Note
          </label>
          <textarea
            placeholder="Document exam results, updates, or instructions (e.g. increase loop diuretics)..."
            {...register('clinicalNote', { required: true })}
            className="w-full h-24 rounded-xl border border-[#4E3629]/15 bg-white/50 px-4 py-2.5 text-sm text-[#4E3629] placeholder-[#4E3629]/40 outline-none focus:border-[#C7A37E] transition-all duration-200"
          />
          <Button
            type="submit"
            variant="glow"
            disabled={isSubmitting}
            className="w-full cursor-pointer flex items-center justify-center space-x-1.5 py-2.5"
          >
            {isSubmitting ? (
              <span>Logging note...</span>
            ) : noted ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Note Logged</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Log Clinical Note</span>
              </>
            )}
          </Button>
        </form>

        {/* Diagnostic Actions */}
        <div className="pt-3 border-t border-[#4E3629]/10 space-y-2 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E3629]/60 block mb-1">
            Simulated AI Diagnostic Actions
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs hover:border-[#C7A37E] hover:text-[#C7A37E] text-[#4E3629]/80 border-[#4E3629]/15"
              onClick={() => {
                setInfoTitle("AI Intake Summary Draft");
                setInfoText("AI Agent Summary compilation triggered. The Codex integration layer will gather multi-source EHR history, vitals telemetry trends, and logged compliance patterns to synthesize a clinical assessment.");
                setInfoOpen(true);
              }}
            >
              Draft AI Intake Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs hover:border-[#C7A37E] hover:text-[#C7A37E] text-[#4E3629]/80 border-[#4E3629]/15"
              onClick={() => {
                setInfoTitle("AI Readmission Risk Assessment");
                setInfoText("AI Discharge check and readmission analysis triggered. Patient compliance logs and physiological simulator indicators will compile into an actionable diagnostic discharge brief.");
                setInfoOpen(true);
              }}
            >
              Analyze Readmission Risk
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        title={infoTitle}
      >
        <div className="space-y-4 text-[#4E3629] text-left">
          <p className="text-xs font-semibold leading-relaxed text-[#4E3629]/80">
            {infoText}
          </p>
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setInfoOpen(false)}
              className="text-xs font-bold px-4 py-2 cursor-pointer"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
};
