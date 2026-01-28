import Joi from 'joi';

export const reportSchema = Joi.object({
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string()
        .valid(
            'ROAD_DAMAGE',
            'SANITATION',
            'STREET_LIGHTS',
            'WATER_SUPPLY',
            'TRAFFIC',
            'PUBLIC_SAFETY',
            'PARKS',
            'OTHER'
        )
        .optional(),
    location: Joi.object({
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().optional(),
    }).required(),
    images: Joi.array().items(Joi.string()).max(5).optional(),
});

export const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid('SUBMITTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
        .required(),
    notes: Joi.string().max(500).optional(),
});

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: any, res: any, next: any) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};
