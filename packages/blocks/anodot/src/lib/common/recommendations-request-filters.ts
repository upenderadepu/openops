export interface RecommendationsRequestFilters {
  status_filter: string;

  user_status?: {
    done?: string;
    excluded?: string;
  };
  is_open?: string;

  open_recs_creation_date: DateRange;
  closed_and_done_recs_dates?: {
    last_update_date: DateRange;
    operator?: string;
    creation_date?: DateRange;
  };

  annual_savings_greater_than?: number;
  cat_id?: number[];

  virtual_tag?: {
    uuid: string;
    eq?: string[];
    like?: string[];
  };
  custom_tags?: TagsFilter;
  enrichment_tags?: TagsFilter;

  region?: CommonFilter;
  type_id?: CommonFilter;
  service?: CommonFilter;
  resource_id?: CommonFilter;
  instance_type?: CommonFilter;
  linked_account_id?: CommonFilter;
}

interface DateRange {
  from: string;
  to: string;
}

interface CommonFilter {
  negate: boolean;
  eq: string[];
}

interface TagsFilter {
  negate: boolean;
  condition: {
    tag: string;
    eq?: string[];
    like?: string[];
    operator?: string;
  }[];
}
