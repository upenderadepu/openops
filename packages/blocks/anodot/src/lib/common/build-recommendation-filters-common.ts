import { isEmpty } from '@openops/shared';
import { RecommendationsRequestFilters } from './recommendations-request-filters';

export function buildBaseRecommendationsRequestFilters(
  props: any,
): RecommendationsRequestFilters {
  const filters: RecommendationsRequestFilters = {
    status_filter: props.statusFilter,
    open_recs_creation_date: {
      from: props.openedRecommendations.from,
      to: props.openedRecommendations.to,
    },
  };

  return filters;
}

export function addCustomStatusFilters(filters: any, props: any) {
  if (!isEmpty(props.customStatus)) {
    if (props.customStatus.isOpen) {
      filters.is_open = props.customStatus.isOpen;
    }

    filters.user_status = {
      done: props.customStatus?.done ?? '',
      excluded: props.customStatus?.excluded ?? '',
    };
  }
}

export function addClosedAndDoneDateFilters(filters: any, props: any) {
  if (!isEmpty(props.closedAndDoneRecommendations)) {
    filters.closed_and_done_recs_dates = {
      last_update_date: {
        from: props.closedAndDoneRecommendations?.lastUpdateDateFrom,
        to: props.closedAndDoneRecommendations?.lastUpdateDateTo,
      },
      creation_date: props.closedAndDoneRecommendations?.creationDateFrom && {
        from: props.closedAndDoneRecommendations?.creationDateFrom,
        to: props.closedAndDoneRecommendations?.creationDateTo,
      },
      operator: props.closedAndDoneRecommendations?.operator,
    };
  }
}

export function addTagFilterIfValid(
  filters: any,
  filterKey: string,
  tagObject: any,
): void {
  if (!isEmpty(tagObject)) {
    filters[filterKey] = {
      negate: tagObject.negate,
      condition: [
        {
          tag: tagObject.tag,
          eq: tagObject.eq,
          like: tagObject.like,
          operator: tagObject.operator,
        },
      ],
    };
  }
}

export function addFilterIfValid(
  filters: any,
  filterKey: string,
  filterObject: any,
): void {
  if (!isEmpty(filterObject) && filterObject.eq) {
    filters[filterKey] = {
      negate: filterObject.negate,
      eq: filterObject.eq,
    };
  }
}
