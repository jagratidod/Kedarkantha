import { z } from 'zod'

export const travellerSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(80),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  travellers: z.number().int().min(1, 'At least 1 traveller').max(10, 'Maximum 10 travellers'),
})

/** Returns { ok, data, errors: {field: message} } */
export function validate(schema, values) {
  const r = schema.safeParse(values)
  if (r.success) return { ok: true, data: r.data, errors: {} }
  const errors = {}
  for (const issue of r.error.issues) errors[issue.path[0]] ??= issue.message
  return { ok: false, data: null, errors }
}
