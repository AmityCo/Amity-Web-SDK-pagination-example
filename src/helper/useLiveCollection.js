import { LoadingStatus } from "@amityco/js-sdk";
import { throttle } from "lodash";
import { useEffect, useState } from "react";

const noop = () => {
  console.warn("[useLiveCollection] noop hit");
};

const useLiveCollection = (
  createLiveCollection,
  dependencies = [],
  debug = true
) => {
  const [data, setData] = useState({
    items: [],
    hasMore: false,
    loadMore: noop,
    loadingFirstTime: true,
    loadingMore: false,
  });

  useEffect(() => {
    const liveCollection = createLiveCollection();
    let loadMoreHasBeenCalled = false;

    const updateLiveCollection = throttle(() => {
      debug && console.log(liveCollection.dataStatus, liveCollection.hasMore);

      const { hasMore = false } = liveCollection;

      setData({
        items: liveCollection.models ? liveCollection.models : [],
        hasMore,
        loadMore: hasMore
          ? () => {
              loadMoreHasBeenCalled = true;
              liveCollection.nextPage();
            }
          : noop,
        loadingFirstTime:
          !loadMoreHasBeenCalled &&
          liveCollection.loadingStatus === LoadingStatus.Loading,
        loadingMore:
          loadMoreHasBeenCalled &&
          liveCollection.loadingStatus === LoadingStatus.Loading,
      });
    }, 50);

    if (debug) {
      window.lc = liveCollection;
    }

    try {
      liveCollection.on("dataUpdated", () => {
        debug && console.log("dataUpdated!");
        updateLiveCollection();
      });

      liveCollection.on("loadingStatusChanged", (statuses) => {
        debug && console.log("loadingStatusChanged!", statuses);
        if (statuses.newValue === "loaded") updateLiveCollection();
      });

      if (liveCollection.models) {
        debug && console.log("from client cache");
        updateLiveCollection();
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development")
        console.warn("[useLiveCollection] error thrown", err);
    }

    return () => liveCollection.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  return [
    data.items,
    data.hasMore,
    data.loadMore,
    data.loadingFirstTime,
    data.loadingMore,
  ];
};

export default useLiveCollection;
