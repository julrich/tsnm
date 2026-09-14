import {StoryblokStory} from 'storyblok-generate-ts'

export interface BlogAsideStoryblok {
  author?: BlogAuthorStoryblok[];
  socialSharing?: SocialSharingStoryblok[];
  readingTime?: string;
  date?: string;
  className?: string;
  _uid: string;
  component: "blog-aside";
}

export interface AssetStoryblok {
  _uid?: string;
  id: number | null;
  alt: string | null;
  name: string;
  focus: string | null;
  source: string | null;
  title: string | null;
  filename: string;
  copyright: string | null;
  fieldtype?: string;
  meta_data?: null | {};
  is_external_url?: boolean;
}

export interface BlogAuthorStoryblok {
  name?: string;
  byline?: string;
  image_src?: AssetStoryblok;
  image_alt?: string;
  image_fullWidth: boolean;
  image_aspectRatio?: "" | "wide" | "square" | "vertical";
  links?: LinksStoryblok[];
  _uid: string;
  component: "blog-author";
}

export interface BlogHeadStoryblok {
  date?: string;
  tags?: TagsStoryblok[];
  headline?: string;
  image?: AssetStoryblok;
  alt?: string;
  _uid: string;
  component: "blog-head";
}

export interface BlogOverviewStoryblok {
  section?: SectionStoryblok[];
  latestTitle?: string;
  latest?: BlogTeaserStoryblok[];
  listTitle?: string;
  list?: BlogTeaserStoryblok[];
  moreTitle?: string;
  more?: BlogTeaserStoryblok[];
  cta?: CtaStoryblok[];
  seo?: SeoStoryblok[];
  _uid: string;
  component: "blog-overview";
}

export interface BlogPostStoryblok {
  head?: BlogHeadStoryblok[];
  aside?: BlogAsideStoryblok[];
  content?: string;
  section?: SectionStoryblok[];
  cta?: CtaStoryblok[];
  seo?: SeoStoryblok[];
  _uid: string;
  component: "blog-post";
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
    };

export interface BlogTeaserStoryblok {
  date?: string;
  tags?: TagsStoryblok[];
  headline?: string;
  teaserText?: string;
  image?: AssetStoryblok;
  alt?: string;
  link_url?: MultilinkStoryblok;
  link_text?: string;
  readingTime?: string;
  author_name?: string;
  author_title?: string;
  author_image?: AssetStoryblok;
  className?: string;
  _uid: string;
  component: "blog-teaser";
}

export interface BusinessCardStoryblok {
  centered: boolean;
  image_src?: AssetStoryblok;
  image_alt?: string;
  logo_src?: AssetStoryblok;
  logo_alt?: string;
  logo_url?: MultilinkStoryblok;
  topic?: string;
  address?: string;
  avatar_src?: AssetStoryblok;
  avatar_alt?: string;
  contactLinks?: ContactLinksStoryblok[];
  buttons?: ButtonsStoryblok[];
  _uid: string;
  component: "business-card";
}

export interface ButtonsStoryblok {
  label?: string;
  url?: MultilinkStoryblok;
  _uid: string;
  component: "buttons";
}

export interface CategoriesStoryblok {
  label?: string;
  _uid: string;
  component: "categories";
}

export interface CategoryCheckboxesStoryblok {
  entry?: string;
  _uid: string;
  component: "categoryCheckboxes";
}

export interface ComponentTypesStoryblok {
  entry?: string;
  _uid: string;
  component: "componentTypes";
}

export interface ContactStoryblok {
  image_src?: AssetStoryblok;
  image_alt?: string;
  image_fullWidth: boolean;
  image_aspectRatio?: "" | "wide" | "square" | "vertical";
  title?: string;
  subtitle?: string;
  links?: LinksStoryblok[];
  copy?: string;
  className?: string;
  component: "contact";
  _uid: string;
}

export interface ContactLinksStoryblok {
  label?: string;
  url?: MultilinkStoryblok;
  _uid: string;
  component: "contactLinks";
}

export interface ContentNavStoryblok {
  image_src?: MultilinkStoryblok;
  image_alt?: string;
  topic?: string;
  links?: LinksStoryblok[];
  initiallyShown?: string;
  _uid: string;
  component: "content-nav";
}

export interface CtaStoryblok {
  headline?: string;
  sub?: string;
  text?: string;
  highlightText: boolean;
  colorNeutral: boolean;
  inverted: boolean;
  buttons?: ButtonsStoryblok[];
  backgroundColor?: string;
  backgroundImage?: AssetStoryblok;
  image_src?: AssetStoryblok;
  image_padding: boolean;
  image_alt?: string;
  image_align?: "" | "center" | "top" | "bottom";
  order_mobileImageLast: boolean;
  order_desktopImageLast: boolean;
  textAlign?: "" | "left" | "center";
  align?: "" | "center" | "top" | "bottom";
  padding: boolean;
  _uid: string;
  component: "cta";
}

export interface DatesStoryblok {
  date?: string;
  time?: string;
  label?: string;
  url?: MultilinkStoryblok;
  newTab: boolean;
  ariaLabel?: string;
  _uid: string;
  component: "dates";
}

export interface DividerStoryblok {
  variant?: "" | "default" | "accent";
  className?: string;
  component: "divider";
  _uid: string;
}

export interface DownloadStoryblok {
  name?: string;
  description?: string;
  previewImage?: AssetStoryblok;
  url?: MultilinkStoryblok;
  size?: string;
  format?: string;
  _uid: string;
  component: "download";
}

export interface DownloadsStoryblok {
  download?: DownloadStoryblok[];
  sharepointFolder?: string;
  _uid: string;
  component: "downloads";
}

export interface EventDetailStoryblok {
  title?: string;
  categories?: CategoriesStoryblok[];
  intro?: string;
  locations?: LocationsStoryblok[];
  download?: DownloadStoryblok[];
  description?: string;
  images?: ImagesStoryblok[];
  button_label?: string;
  button_url?: MultilinkStoryblok;
  _uid: string;
  component: "event-detail";
}

export interface EventFilterStoryblok {
  datePicker_title?: string;
  "datePicker_tab-9845e305-4b8c-40da-a7dc-550aed5fc55c"?: unknown;
  "datePicker_tab-a444e6b5-0f02-407f-84b1-0a82454bac92"?: unknown;
  datePicker_toggle: boolean;
  categories_title?: string;
  categories_categoryCheckboxes?: CategoryCheckboxesStoryblok[];
  categories_toggle: boolean;
  applyButton_label?: string;
  applyButton_onClick?: string;
  resetButton_label?: string;
  resetButton_onClick?: string;
  _uid: string;
  component: "event-filter";
}

export interface EventLatestTeaserStoryblok {
  date?: string;
  calendar_month?: string;
  calendar_day?: string;
  title?: string;
  location?: string;
  url?: MultilinkStoryblok;
  cta?: string;
  ariaLabel?: string;
  className?: string;
  _uid: string;
  component: "event-latest-teaser";
}

export interface EventListStoryblok {
  filter?: EventFilterStoryblok[];
  events?: EventListTeaserStoryblok[];
  _uid: string;
  component: "event-list";
}

export interface EventListTeaserStoryblok {
  category?: string;
  title?: string;
  text?: string;
  date?: string;
  time?: string;
  location_name?: string;
  location_address?: string;
  tags?: TagsStoryblok[];
  image_src?: AssetStoryblok;
  image_alt?: string;
  url?: MultilinkStoryblok;
  ctaText?: string;
  ariaLabel?: string;
  className?: string;
  _uid: string;
  component: "event-list-teaser";
}

export interface FaqStoryblok {
  questions?: QuestionsStoryblok[];
  _uid: string;
  component: "faq";
}

export interface FeatureStoryblok {
  title?: string;
  text?: string;
  cta_url?: MultilinkStoryblok;
  cta_label?: string;
  _uid: string;
  component: "feature";
}

export interface FeaturesStoryblok {
  layout?: "" | "largeTiles" | "smallTiles" | "list";
  style?: "" | "intext" | "stack" | "centered" | "besideLarge" | "besideSmall";
  ctas_toggle: boolean;
  ctas_style?: "" | "button" | "link" | "intext";
  feature?: FeatureStoryblok[];
  _uid: string;
  component: "features";
}

export interface FooterStoryblok {
  logo_src?: AssetStoryblok;
  logo_srcInverted?: AssetStoryblok;
  logo_alt?: string;
  logo_homepageHref?: MultilinkStoryblok;
  logo_width?: string;
  logo_height?: string;
  inverted: boolean;
  navGroups?: NavGroupsStoryblok[];
  copyright?: string;
  legalLink_label?: string;
  legalLink_url?: MultilinkStoryblok;
  socialLinks?: SocialLinksStoryblok[];
  _uid: string;
  component: "footer";
}

export interface GalleryStoryblok {
  images?: ImagesStoryblok[];
  layout?: "" | "stack" | "smallTiles" | "largeTiles" | "slider";
  aspectRatio?: "" | "unset" | "square" | "wide" | "landscape";
  lightbox: boolean;
  _uid: string;
  component: "gallery";
}

export interface GlobalStoryblok {
  global?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | TabE9Adcc38E71E4C418Be01C42E04E0BadStoryblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | SplitEvenStoryblok
    | SplitWeightedStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
    | InfoTableStoryblok
    | PrompterStoryblok
  )[];
  _uid: string;
  component: "global";
  uuid?: string;
}

export interface GlobalReferenceStoryblok {
  reference?: unknown[];
  _uid: string;
  component: "global_reference";
}

export interface HeaderStoryblok {
  logo_src?: AssetStoryblok;
  logo_srcInverted?: AssetStoryblok;
  logo_alt?: string;
  logo_homepageHref?: MultilinkStoryblok;
  logo_width?: string;
  logo_height?: string;
  flyoutInverted: boolean;
  dropdownInverted: boolean;
  floating: boolean;
  inverted: boolean;
  navItems?: NavItemsStoryblok[];
  _uid: string;
  component: "header";
}

export interface HeadlineStoryblok {
  text?: string;
  sub?: string;
  switchOrder: boolean;
  align?: "" | "left" | "center" | "right";
  level?: "" | "h1" | "h2" | "h3" | "h4" | "p";
  style?: "" | "h1" | "h2" | "h3" | "h4" | "p";
  spaceAfter?: "" | "minimum" | "small" | "large";
  className?: string;
  id?: string;
  _uid: string;
  component: "headline";
}

export interface HeroStoryblok {
  headline?: string;
  sub?: string;
  text?: string;
  highlightText: boolean;
  colorNeutral: boolean;
  height?: "" | "small" | "default" | "fullImage" | "fullScreen";
  textbox: boolean;
  mobileTextBelow: boolean;
  invertText: boolean;
  buttons?: ButtonsStoryblok[];
  skipButton: boolean;
  overlay: boolean;
  image_srcMobile?: AssetStoryblok;
  image_srcTablet?: AssetStoryblok;
  image_srcDesktop?: AssetStoryblok;
  image_src?: AssetStoryblok;
  image_indent?: "" | "none" | "left" | "right";
  image_alt?: string;
  textPosition?: "" | "center" | "below" | "offset" | "left" | "right" | "corner" | "bottom";
  _uid: string;
  component: "hero";
}

export interface HtmlStoryblok {
  html?: string;
  consent: boolean;
  consentText?: string;
  consentButtonLabel?: string;
  consentBackgroundImage?: AssetStoryblok;
  consentAspectRatio?: "" | "VALUE_16_9" | "VALUE_16_10" | "VALUE_4_3" | "VALUE_1_1";
  inverted: boolean;
  className?: string;
  component: "html";
  _uid: string;
}

export interface ImagesStoryblok {
  src?: AssetStoryblok;
  alt?: string;
  caption?: string;
  _uid: string;
  component: "images";
}

export interface ImageStoryStoryblok {
  headline?: string;
  largeHeadline: boolean;
  sub?: string;
  text?: string;
  layout?: "" | "textLeft" | "imageLeft";
  padding: boolean;
  buttons?: ButtonsStoryblok[];
  image_src?: AssetStoryblok;
  image_aspectRatio?: "" | "unset" | "square" | "wide" | "landscape";
  image_alt?: string;
  image_vAlign?: "" | "center" | "top" | "bottom";
  textAlign?: "" | "left" | "center";
  _uid: string;
  component: "image-story";
}

export interface ImageTextStoryblok {
  text?: string;
  highlightText: boolean;
  image_src?: AssetStoryblok;
  image_alt?: string;
  layout?: "" | "above" | "below" | "beside_right" | "beside_left";
  _uid: string;
  component: "image-text";
}

export interface TableStoryblok {
  thead: {
    _uid: string;
    value?: string;
    component: number;
  }[];
  tbody: {
    _uid: string;
    body: {
      _uid?: string;
      value?: string;
      component?: number;
    }[];
    component: number;
  }[];
}

export interface InfoTableStoryblok {
  data?: TableStoryblok;
  _uid: string;
  component: "info-table";
}

export interface ItemsStoryblok {
  url?: MultilinkStoryblok;
  label?: string;
  active: boolean;
  _uid: string;
  component: "items";
}

export interface LinksStoryblok {
  label?: string;
  url?: MultilinkStoryblok;
  newTab: boolean;
  ariaLabel?: string;
  _uid: string;
  component: "links";
}

export interface LocationsStoryblok {
  dates?: DatesStoryblok[];
  locationName?: string;
  displayMode?: "" | "spacious" | "compact";
  address?: string;
  links?: LinksStoryblok[];
  _uid: string;
  component: "locations";
}

export interface LogoStoryblok {
  src?: AssetStoryblok;
  alt?: string;
  _uid: string;
  component: "logo";
}

export interface LogosStoryblok {
  tagline?: string;
  logo?: LogoStoryblok[];
  align?: "" | "left" | "center";
  logosPerRow?: string;
  cta_toggle: boolean;
  cta_text?: string;
  cta_link?: MultilinkStoryblok;
  cta_label?: string;
  cta_style?: "" | "button" | "text";
  _uid: string;
  component: "logos";
}

export interface MatchesStoryblok {
  title?: string;
  snippet?: string;
  url?: string;
  _uid: string;
  component: "matches";
}

export interface MosaicStoryblok {
  layout?: "" | "alternate" | "textLeft" | "textRight";
  largeHeadlines: boolean;
  tile?: TileStoryblok[];
  _uid: string;
  component: "mosaic";
}

export interface NavGroupsStoryblok {
  heading?: string;
  items?: ItemsStoryblok[];
  _uid: string;
  component: "navGroups";
}

export interface NavItemsStoryblok {
  url?: MultilinkStoryblok;
  label?: string;
  active: boolean;
  items?: ItemsStoryblok[];
  _uid: string;
  component: "navItems";
}

export interface PageStoryblok {
  section?: SectionStoryblok[];
  header_floating: boolean;
  header_inverted: boolean;
  header_logo?: AssetStoryblok;
  footer_inverted: boolean;
  footer_logo?: AssetStoryblok;
  token?: string;
  hidePageBreadcrumbs: boolean;
  seo?: SeoStoryblok[];
  theme?: string;
  _uid: string;
  component: "page";
  uuid?: string;
}

export interface PrompterStoryblok {
  mode?: "" | "section" | "page";
  componentTypes?: ComponentTypesStoryblok[];
  sections?: string;
  includeStory: boolean;
  useIdea: boolean;
  relatedStories?: RelatedStoriesStoryblok[];
  userPrompt?: string;
  systemPrompt?: string;
  contentType?: "" | "page" | "blog_post" | "blog_overview";
  startsWith?: string;
  uploadAssets: boolean;
  _uid: string;
  component: "prompter";
}

export interface QuestionsStoryblok {
  question?: string;
  answer?: string;
  _uid: string;
  component: "questions";
}

export interface RelatedStoriesStoryblok {
  entry?: string;
  _uid: string;
  component: "relatedStories";
}

export interface SearchStoryblok {
  headline?: HeadlineStoryblok[];
  searchBar?: SearchBarStoryblok[];
  searchFilter?: SearchFilterStoryblok[];
  searchResults?: SearchResultsStoryblok[];
  _uid: string;
  component: "search";
}

export interface SearchBarStoryblok {
  placeholder?: string;
  buttonText?: string;
  hint?: string;
  alternativeText?: string;
  alternativeResult?: string;
  _uid: string;
  component: "search-bar";
}

export interface SearchFilterStoryblok {
  title?: string;
  categories?: CategoriesStoryblok[];
  _uid: string;
  component: "search-filter";
}

export interface SearchResultsStoryblok {
  url?: string;
  title?: string;
  imageColSize?: "" | "none" | "small" | "large";
  previewImage?: string;
  initialMatch?: string;
  matches?: MatchesStoryblok[];
  showLink: boolean;
  _uid: string;
  component: "searchResults";
}

export interface SectionStoryblok {
  width?: "" | "full" | "max" | "wide" | "default" | "narrow";
  style?: "" | "default" | "framed" | "deko";
  backgroundColor?: "" | "default" | "accent" | "bold";
  transition?: "" | "none" | "to_default" | "to_accent" | "to_bold" | "to_inverted";
  backgroundImage?: AssetStoryblok;
  spotlight: boolean;
  spaceBefore?: "" | "default" | "small" | "none";
  spaceAfter?: "" | "default" | "small" | "none";
  inverted: boolean;
  headerSpacing: boolean;
  headline_text?: string;
  headline_large: boolean;
  headline_width?: "" | "unset" | "narrow" | "default" | "wide";
  headline_textAlign?: "" | "left" | "center" | "right";
  headline_align?: "" | "left" | "center" | "right";
  headline_sub?: string;
  headline_switchOrder: boolean;
  content_width?: "" | "unset" | "narrow" | "default" | "wide";
  content_align?: "" | "left" | "center" | "right";
  content_gutter?: "" | "large" | "default" | "small" | "none";
  content_mode?: "" | "default" | "tile" | "list" | "slider";
  content_tileWidth?: "" | "smallest" | "default" | "medium" | "large" | "largest" | "full";
  components?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | TabE9Adcc38E71E4C418Be01C42E04E0BadStoryblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | SplitEvenStoryblok
    | SplitWeightedStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
    | InfoTableStoryblok
    | PrompterStoryblok
    | GlobalReferenceStoryblok
  )[];
  buttons?: ButtonsStoryblok[];
  aiDraft: boolean;
  anchorId?: string;
  _uid: string;
  component: "section";
}

export interface SeoStoryblok {
  title?: string;
  description?: string;
  keywords?: string;
  image?: AssetStoryblok;
  cardImage?: AssetStoryblok;
  _uid: string;
  component: "seo";
}

export interface SettingsStoryblok {
  header?: HeaderStoryblok[];
  footer?: FooterStoryblok[];
  seo?: SeoStoryblok[];
  iconSprite?: string;
  token?: string;
  hideBreadcrumbs: boolean;
  theme?: string;
  headerButton_enabled: boolean;
  headerButton_label?: string;
  headerButton_url?: MultilinkStoryblok;
  _uid: string;
  component: "settings";
}

export interface SliderStoryblok {
  autoplay: boolean;
  nav: boolean;
  teaseNeighbours: boolean;
  equalHeight: boolean;
  gap?: string;
  arrows: boolean;
  variant?: "" | "slider" | "carousel";
  className?: string;
  components?: (
    | CtaStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeroStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
  )[];
  _uid: string;
  component: "slider";
}

export interface SocialLinksStoryblok {
  icon?: string;
  url?: MultilinkStoryblok;
  ariaLabel?: string;
  _uid: string;
  component: "socialLinks";
}

export interface SocialSharingStoryblok {
  url?: MultilinkStoryblok;
  title?: string;
  _uid: string;
  component: "socialSharing";
}

export interface SplitEvenStoryblok {
  contentMinWidth?: "" | "narrow" | "medium" | "wide";
  contentGutter?: "" | "small" | "default" | "large" | "none";
  mobileReverse: boolean;
  verticalAlign?: "" | "top" | "center" | "bottom" | "sticky";
  verticalGutter?: "" | "large" | "default" | "small" | "none";
  horizontalGutter?: "" | "large" | "default" | "small" | "none";
  firstLayout_layout?: "" | "smallTiles" | "largeTiles" | "list";
  firstLayout_gutter?: "" | "none" | "small" | "default" | "large";
  firstLayout_stretchVertically: boolean;
  secondLayout_layout?: "" | "smallTiles" | "largeTiles" | "list";
  secondLayout_stretchVertically: boolean;
  secondLayout_gutter?: "" | "none" | "small" | "default" | "large";
  firstComponents?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | Tab3Ef3Bf02E22D4B97Aac7A7E69247688CStoryblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
  )[];
  secondComponents?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | Tab1Dd56D17C1D649F5B32564Be24675882Storyblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
  )[];
  _uid: string;
  component: "split-even";
}

export interface SplitWeightedStoryblok {
  verticalGutter?: "" | "large" | "default" | "small" | "none";
  horizontalGutter?: "" | "large" | "default" | "small" | "none";
  verticalAlign?: "" | "top" | "center" | "bottom" | "sticky";
  mainLayout_gutter?: "" | "large" | "default" | "small" | "none";
  mainLayout_minWidth?: "" | "narrow" | "default" | "wide";
  mainLayout_stretchVertically: boolean;
  mainLayout_layout?: "" | "smallTiles" | "largeTiles" | "list";
  asideLayout_gutter?: "" | "large" | "default" | "small" | "none";
  asideLayout_minWidth?: "" | "narrow" | "default" | "wide";
  asideLayout_stretchVertically: boolean;
  asideLayout_layout?: "" | "smallTiles" | "largeTiles" | "list";
  order_mobile?: "" | "mainFirst" | "asideFirst";
  order_desktop?: "" | "mainFirst" | "asideFirst";
  mainComponents?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | TabCcb3807F02E14D09A644A14D685Bd30AStoryblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
  )[];
  asideComponents?: (
    | BlogTeaserStoryblok
    | BusinessCardStoryblok
    | Tab9D11Ce045A1D46E0A764Bee596C3E9F0Storyblok
    | ContactStoryblok
    | ContentNavStoryblok
    | CtaStoryblok
    | DividerStoryblok
    | DownloadsStoryblok
    | EventLatestTeaserStoryblok
    | EventListTeaserStoryblok
    | FaqStoryblok
    | FeaturesStoryblok
    | GalleryStoryblok
    | HeadlineStoryblok
    | HeroStoryblok
    | HtmlStoryblok
    | ImageStoryStoryblok
    | ImageTextStoryblok
    | LogosStoryblok
    | MosaicStoryblok
    | SliderStoryblok
    | StatsStoryblok
    | TeaserCardStoryblok
    | TestimonialsStoryblok
    | TextStoryblok
    | VideoCurtainStoryblok
  )[];
  _uid: string;
  component: "split-weighted";
}

export interface StatStoryblok {
  number?: string;
  description?: string;
  title?: string;
  _uid: string;
  component: "stat";
}

export interface StatsStoryblok {
  align?: "" | "left" | "center";
  stat?: StatStoryblok[];
  _uid: string;
  component: "stats";
}

export interface Tab03569F915Ef444F586Bd845Cc951Df4EStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-03569f91-5ef4-44f5-86bd-845cc951df4e";
}

export interface Tab124571D0Ddc74FcdA5A719Cb17B00085Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-124571d0-ddc7-4fcd-a5a7-19cb17b00085";
}

export interface Tab1D716Ded384D43FfB9AeDdde7E96E210Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-1d716ded-384d-43ff-b9ae-ddde7e96e210";
}

export interface Tab1Dd56D17C1D649F5B32564Be24675882Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-1dd56d17-c1d6-49f5-b325-64be24675882";
}

export interface Tab3Ef3Bf02E22D4B97Aac7A7E69247688CStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-3ef3bf02-e22d-4b97-aac7-a7e69247688c";
}

export interface Tab4A39D458E64241Dd86553A14Ec3C9200Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-4a39d458-e642-41dd-8655-3a14ec3c9200";
}

export interface Tab653A52Ea71764B03B59EE16C54Dd9479Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-653a52ea-7176-4b03-b59e-e16c54dd9479";
}

export interface Tab76301A8D4Cba46C388C5Df5Eab2E1450Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-76301a8d-4cba-46c3-88c5-df5eab2e1450";
}

export interface Tab76A4E6Bd11514Bf086810864E9711294Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-76a4e6bd-1151-4bf0-8681-0864e9711294";
}

export interface Tab80D7600F78Bd484DA5063A4D6589CffcStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-80d7600f-78bd-484d-a506-3a4d6589cffc";
}

export interface Tab87939Cb29Fe2473FAb1CBfe6Ab9E5391Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-87939cb2-9fe2-473f-ab1c-bfe6ab9e5391";
}

export interface Tab89A9Cf3F225B4Fa7968C80446Ad53932Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-89a9cf3f-225b-4fa7-968c-80446ad53932";
}

export interface Tab9Cfb8F2C01744BccA44B617A9827Cd83Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-9cfb8f2c-0174-4bcc-a44b-617a9827cd83";
}

export interface Tab9D11Ce045A1D46E0A764Bee596C3E9F0Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-9d11ce04-5a1d-46e0-a764-bee596c3e9f0";
}

export interface TabA89Ded3500D24D8CAaaa8678F8D0C5CaStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-a89ded35-00d2-4d8c-aaaa-8678f8d0c5ca";
}

export interface TabB0C2886DBedb4534Bc66317A1D1691A3Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-b0c2886d-bedb-4534-bc66-317a1d1691a3";
}

export interface TabC0858FedBbb4402E9Ab9C58A6C2Dda73Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-c0858fed-bbb4-402e-9ab9-c58a6c2dda73";
}

export interface TabCcb3807F02E14D09A644A14D685Bd30AStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-ccb3807f-02e1-4d09-a644-a14d685bd30a";
}

export interface TabE9Adcc38E71E4C418Be01C42E04E0BadStoryblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-e9adcc38-e71e-4c41-8be0-1c42e04e0bad";
}

export interface TabEaf8A1Cd33Fe4C59A838C6Bbc6Cde372Storyblok {
  button_label?: string;
  button_url?: MultilinkStoryblok;
  button_variant?: "" | "primary" | "secondary" | "tertiary";
  button_size?: "" | "small" | "medium" | "large";
  button_disabled: boolean;
  button_type?: "" | "button" | "submit" | "reset";
  _uid: string;
  component: "tab-eaf8a1cd-33fe-4c59-a838-c6bbc6cde372";
}

export interface TagsStoryblok {
  entry?: string;
  _uid: string;
  component: "tags";
}

export interface TeaserCardStoryblok {
  headline?: string;
  text?: string;
  label?: string;
  layout?: "" | "stack" | "row" | "compact";
  centered: boolean;
  url?: MultilinkStoryblok;
  button_label?: string;
  button_chevron: boolean;
  button_hidden: boolean;
  image?: AssetStoryblok;
  imageAlt?: string;
  imageRatio?: "" | "wide" | "landscape" | "square" | "unset";
  imageHoverEffect: boolean;
  _uid: string;
  component: "teaser-card";
}

export interface TestimonialStoryblok {
  quote?: string;
  name?: string;
  title?: string;
  image_src?: AssetStoryblok;
  image_alt?: string;
  rating?: string;
  _uid: string;
  component: "testimonial";
}

export interface TestimonialsStoryblok {
  layout?: "" | "slider" | "list" | "alternating";
  quoteSigns?: "" | "normal" | "large" | "none";
  testimonial?: TestimonialStoryblok[];
  _uid: string;
  component: "testimonials";
}

export interface TextStoryblok {
  text?: string;
  layout?: "" | "singleColumn" | "multiColumn";
  align?: "" | "left" | "center";
  highlightText: boolean;
  _uid: string;
  component: "text";
}

export interface TileStoryblok {
  headline?: string;
  sub?: string;
  text?: string;
  image_src?: AssetStoryblok;
  image_alt?: string;
  button_toggle: boolean;
  button_label?: string;
  button_url?: MultilinkStoryblok;
  backgroundColor?: string;
  backgroundImage?: AssetStoryblok;
  textColor?: string;
  _uid: string;
  component: "tile";
}

export interface TokenThemeStoryblok {
  name: string;
  tokens?: string;
  css?: string;
  system: boolean;
  _uid: string;
  component: "token-theme";
}

export interface VideoCurtainStoryblok {
  headline?: string;
  sub?: string;
  text?: string;
  highlightText: boolean;
  colorNeutral: boolean;
  buttons?: ButtonsStoryblok[];
  overlay: boolean;
  video_srcMobile?: AssetStoryblok;
  video_srcTablet?: AssetStoryblok;
  video_srcDesktop?: AssetStoryblok;
  textPosition?: "" | "center" | "bottom" | "left" | "right" | "corner";
  _uid: string;
  component: "video-curtain";
}
