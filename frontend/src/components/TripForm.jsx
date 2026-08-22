import { useEffect, useState } from 'react';

const emptyForm = { title: '', description: '', startDate: '', endDate: '' };

function toInputDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : '';
}

export default function TripForm({ initialTrip, isSubmitting, serverError, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm(initialTrip ? {
      title: initialTrip.title || '',
      description: initialTrip.description || '',
      startDate: toInputDate(initialTrip.startDate),
      endDate: toInputDate(initialTrip.endDate),
    } : emptyForm);
  }, [initialTrip]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidationError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.startDate || !form.endDate) {
      setValidationError('Title, start date, and end date are required.');
      return;
    }
    if (form.endDate < form.startDate) {
      setValidationError('End date must be on or after start date.');
      return;
    }
    onSubmit({ title: form.title.trim(), description: form.description.trim() || null, startDate: form.startDate, endDate: form.endDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {validationError || serverError ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{validationError || serverError}</div> : null}
      <div><label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-slate-700">Trip title</label><input id="title" name="title" value={form.title} onChange={onChange} placeholder="e.g. Kyoto in spring" className="field" autoFocus required /></div>
      <div><label htmlFor="description" className="mb-1.5 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label><textarea id="description" name="description" value={form.description} onChange={onChange} placeholder="What makes this trip special?" rows="4" className="field resize-y" /></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="startDate" className="mb-1.5 block text-sm font-semibold text-slate-700">Start date</label><input id="startDate" name="startDate" type="date" value={form.startDate} onChange={onChange} className="field" required /></div><div><label htmlFor="endDate" className="mb-1.5 block text-sm font-semibold text-slate-700">End date</label><input id="endDate" name="endDate" type="date" value={form.endDate} onChange={onChange} className="field" required /></div></div>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">{onCancel ? <button type="button" onClick={onCancel} className="button-secondary">Cancel</button> : null}<button type="submit" disabled={isSubmitting} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Saving trip...' : initialTrip ? 'Save changes' : 'Create trip'}</button></div>
    </form>
  );
}