import { Result } from "../../results";
import { RequestWrapper } from "../RequestWrapper";

const MAX_CACHE_AGE = 60 * 60 * 24 * 365; // 365 days
const DEFAULT_CACHE_AGE = 60 * 60 * 24 * 7; // 7 days
const MAX_BUCKET_SIZE = 20;

export interface CacheSettings {
  shouldSaveToCache: boolean;
  shouldReadFromCache: boolean;
  cacheControl: string;
  bucketSettings: {
    maxSize: number;
  };
  cacheKey?: string;
}

function buildCacheControl(cacheControl: string): string {
  const sMaxAge = cacheControl.match(/s-maxage=(\d+)/)?.[1];
  const maxAge = cacheControl.match(/max-age=(\d+)/)?.[1];

  if (sMaxAge || maxAge) {
    let sMaxAgeInSeconds = 0;
    try {
      sMaxAgeInSeconds = sMaxAge
        ? parseInt(sMaxAge)
        : maxAge
        ? parseInt(maxAge)
        : 0;
    } catch (e) {
      console.error("Error parsing s-maxage or max-age", e);
    }
    if (sMaxAgeInSeconds > MAX_CACHE_AGE) {
      return `public, max-age=${MAX_CACHE_AGE}`;
    }
    return `public, max-age=${sMaxAgeInSeconds}`;
  } else {
    return `public, max-age=${DEFAULT_CACHE_AGE}`;
  }
}

export function getCacheSettings(
  requestWrapper: RequestWrapper,
  isStream: boolean
): Result<CacheSettings, string> {
  // streams cannot be cached
  if (isStream) {
    return {
      data: {
        shouldReadFromCache: false,
        shouldSaveToCache: false,
        cacheControl: "no-cache",
        bucketSettings: {
          maxSize: 1,
        },
      },
      error: null,
    };
  }

  try {
    const cacheHeaders = requestWrapper.getCacheState();

    const shouldSaveToCache =
      cacheHeaders.cacheEnabled || cacheHeaders.cacheSave;
    const shouldReadFromCache =
      cacheHeaders.cacheEnabled || cacheHeaders.cacheRead;

    const cacheControl = buildCacheControl(
      requestWrapper.headers.get("Cache-Control") ?? ""
    );
    if (cacheHeaders.cacheBucketMaxSize > MAX_BUCKET_SIZE) {
      return {
        error: `Cache bucket size cannot be greater than ${MAX_BUCKET_SIZE}`,
        data: null,
      };
    }

    return {
      error: null,
      data: {
        shouldReadFromCache,
        shouldSaveToCache,
        cacheControl,
        bucketSettings: {
          maxSize: cacheHeaders.cacheBucketMaxSize,
        },
        cacheKey: cacheHeaders.cacheKey,
      },
    };
  } catch (e) {
    return {
      error: JSON.stringify(e),
      data: null,
    };
  }
}
