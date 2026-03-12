import { Route } from "../../../db/schemas/routes/RoutesSchema";
import { GRADE_LABELS_BY_CLIMB_TYPE } from "../constants/gradeLabels";

export type RouteWithGradeLabel = Route & { grade_label: string };

export const toRouteWithGradeLabel = (route: Route): RouteWithGradeLabel => {
  const labelsByGradeType = GRADE_LABELS_BY_CLIMB_TYPE[route.climb_type];
  const labels = labelsByGradeType[route.grade_type];

  return {
    ...route,
    grade_label:
      labels?.[route.grade_value] ??
      `unmapped (${route.climb_type}:${route.grade_type}:${route.grade_value})`,
  };
};
