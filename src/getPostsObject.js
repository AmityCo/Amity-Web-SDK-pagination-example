import React, { useEffect, useState } from "react";
import { PostRepository, FeedType } from "@amityco/js-sdk";
import useLiveCollection from "../src/helper/useLiveCollection";
import InfiniteScroll from "react-infinite-scroller";

const COMMUNITYID = process.env.REACT_APP_COMMUNITYID;

function GetPostsObject() {
  const [posts, hasMore, loadMore] = useLiveCollection(() =>
    PostRepository.queryCommunityPosts({
      communityId: COMMUNITYID,
      feedType: FeedType.Published,
      limit: 10,
    })
  );

  const [postData, setPostsData] = useState(posts);
  const [hasMoreData, setHasMoreData] = useState(hasMore);
  const [loadMoreData, setLoadMoreData] = useState(loadMore);

  useEffect(() => {
    if (posts.length > 0) {
      setPostsData(posts);
      setHasMoreData(hasMoreData);
      setLoadMoreData(loadMore);
    }
  }, [posts, hasMore, loadMore]);

  return (
    <div>
      <InfiniteScroll
        initialLoad={false}
        hasMore={hasMoreData}
        loadMore={loadMoreData}
        useWindow={false}
        // TODO: REMOVE when SDK Provide filter by membership
        threshold={1}
        loader={hasMoreData && <span key={0}>Loading...</span>}
      >
        {postData.map(({ postId, createdAt }) => (
          <div key={postId}>
            <p>{`postId: ${postId}`}</p>
            <p>{`createdAt: ${createdAt}`}</p>
            <hr></hr>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default GetPostsObject;
