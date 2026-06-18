import type { CollectionBeforeValidateHook } from "payload";
import { ValidationError } from "payload";

type TRelationValue =
	| string
	| number
	| { id: string | number }
	| null
	| undefined;

const getRelationId = (value: TRelationValue): string | number | null => {
	if (value == null) {
		return null;
	}

	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	if (typeof value === "object" && "id" in value && value.id != null) {
		return value.id;
	}

	return null;
};

const idsMatch = (
	a: string | number | null,
	b: string | number | null
): boolean => {
	if (a == null || b == null) {
		return false;
	}

	return String(a) === String(b);
};

export const validateCityHierarchy: CollectionBeforeValidateHook = async ({
	data,
	req
}) => {
	if (!data) {
		return data;
	}

	const countryId = getRelationId(data.country as TRelationValue);
	const regionId = getRelationId(data.region as TRelationValue);

	if (!countryId || !regionId) {
		return data;
	}

	const region = await req.payload.findByID({
		collection: "regions",
		id: regionId,
		depth: 0
	});

	const regionCountryId = getRelationId(region.country as TRelationValue);

	if (!idsMatch(regionCountryId, countryId)) {
		throw new ValidationError({
			errors: [
				{
					message: "region.country must match country",
					path: "region"
				}
			]
		});
	}

	return data;
};

export const validateAttractionHierarchy: CollectionBeforeValidateHook =
	async ({ data, req }) => {
		if (!data) {
			return data;
		}

		const countryId = getRelationId(data.country as TRelationValue);
		const regionId = getRelationId(data.region as TRelationValue);
		const cityId = getRelationId(data.city as TRelationValue);

		if (!countryId || !cityId) {
			return data;
		}

		const city = await req.payload.findByID({
			collection: "cities",
			id: cityId,
			depth: 0
		});

		const cityCountryId = getRelationId(city.country as TRelationValue);
		const cityRegionId = getRelationId(city.region as TRelationValue);

		if (!idsMatch(cityCountryId, countryId)) {
			throw new ValidationError({
				errors: [
					{
						message: "city.country must match country",
						path: "city"
					}
				]
			});
		}

		// ARCH: region optional in schema — skip region.country when region is not set
		if (regionId) {
			const region = await req.payload.findByID({
				collection: "regions",
				id: regionId,
				depth: 0
			});

			const regionCountryId = getRelationId(
				region.country as TRelationValue
			);

			if (!idsMatch(regionCountryId, countryId)) {
				throw new ValidationError({
					errors: [
						{
							message: "region.country must match country",
							path: "region"
						}
					]
				});
			}

			if (!idsMatch(cityRegionId, regionId)) {
				throw new ValidationError({
					errors: [
						{
							message: "city.region must match region",
							path: "city"
						}
					]
				});
			}
		}

		return data;
	};

export const validateExperienceHierarchy: CollectionBeforeValidateHook =
	async ({ data, req }) => {
		if (!data) {
			return data;
		}

		const countryId = getRelationId(data.country as TRelationValue);
		const regionId = getRelationId(data.region as TRelationValue);
		const cityId = getRelationId(data.city as TRelationValue);
		const attractionId = getRelationId(data.attraction as TRelationValue);

		if (!countryId) {
			return data;
		}

		if (regionId) {
			const region = await req.payload.findByID({
				collection: "regions",
				id: regionId,
				depth: 0
			});

			const regionCountryId = getRelationId(
				region.country as TRelationValue
			);

			if (!idsMatch(regionCountryId, countryId)) {
				throw new ValidationError({
					errors: [
						{
							message: "region.country must match country",
							path: "region"
						}
					]
				});
			}
		}

		if (cityId) {
			const city = await req.payload.findByID({
				collection: "cities",
				id: cityId,
				depth: 0
			});

			const cityCountryId = getRelationId(city.country as TRelationValue);
			const cityRegionId = getRelationId(city.region as TRelationValue);

			if (!idsMatch(cityCountryId, countryId)) {
				throw new ValidationError({
					errors: [
						{
							message: "city.country must match country",
							path: "city"
						}
					]
				});
			}

			if (regionId && !idsMatch(cityRegionId, regionId)) {
				throw new ValidationError({
					errors: [
						{
							message: "city.region must match region",
							path: "city"
						}
					]
				});
			}
		}

		if (attractionId) {
			const attraction = await req.payload.findByID({
				collection: "attractions",
				id: attractionId,
				depth: 0
			});

			const attractionCityId = getRelationId(
				attraction.city as TRelationValue
			);

			if (cityId && !idsMatch(attractionCityId, cityId)) {
				throw new ValidationError({
					errors: [
						{
							message: "attraction.city must match city",
							path: "attraction"
						}
					]
				});
			}
		}

		return data;
	};
