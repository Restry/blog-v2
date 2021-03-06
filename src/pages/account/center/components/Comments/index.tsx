import React from 'react';
import { Icon, List } from 'antd';
import { Link } from 'umi';
import { parse } from 'qs';
import { get } from 'lodash';
import MarkdownBody from '@/components/MarkdownBody';
import { AccountCenterModelState, ConnectProps, Loading } from '@/models/connect';
import { IComment } from '@/models/data';
import styles from './index.less';

const defaultQueryParams = {
  include: 'commentable,parent.user',
};

const IconText: React.FC<{
  type: string;
  text: React.ReactNode;
}> = ({ type, text }) => (
  <span style={{ marginRight: 16 }}>
    <Icon type={type} style={{ marginRight: 4 }} />
    {text}
  </span>
);

interface CommentsProps extends ConnectProps {
  loading: Loading;
  accountCenter: AccountCenterModelState;

  [key: string]: any;
}

class Comments extends React.Component<CommentsProps> {
  UNSAFE_componentWillMount () {
    this.queryComments(this.props.location.search);
  }

  queryComments = (params: object | string) => {
    const query = params instanceof Object ? params : parse(params.replace(/^\?/, ''));

    const queryParams = {
      ...defaultQueryParams,
      ...query,
    };

    this.props.dispatch({
      type: 'accountCenter/fetchComments',
      payload: queryParams,
    });
  };

  handlePageChange = (page: number, pageSize?: number) => {
    const { location: { search } } = this.props;
    const query = parse(search.replace(/^\?/, ''));
    this.queryComments({ ...query, page, pageSize });
  };

  renderItemTitle = (comment: IComment) => {
    switch (comment.commentable_type) {
      case 'App\\Models\\Article':
        return (
          <Link to={`/articles/${comment.commentable_id}`}>
            {get(comment, 'commentable.title')}
          </Link>
        );
      default:
        return null;
    }
  };

  render () {
    const {
      loading,
      accountCenter: { comments: { list, meta } },
    } = this.props;

    return (
      <div className={styles.list}>
        <List
          size="large"
          rowKey="id"
          itemLayout="vertical"
          loading={loading.effects['accountCenter/fetchComments']}
          dataSource={list}
          pagination={{
            total: meta.total,
            current: meta.current_page,
            pageSize: meta.per_page || 10,
            simple: window.innerWidth < 768,
            onChange: this.handlePageChange,
          }}
          renderItem={(item: IComment) => (
            <List.Item>
              <List.Item.Meta
                title={this.renderItemTitle(item)}
              />
              <div className={styles.content}>
                <div className={styles.description}>
                  <MarkdownBody markdown={get(item, 'content.combine_markdown')} />
                </div>
                <div className={styles.extra}>
                  <IconText type="clock-circle-o" text={item.created_at_timeago} />
                  <IconText key="like" type="like-o" text={item.friendly_up_voters_count} />
                  <IconText type="message" key="message" text={item.friendly_comments_count} />
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default Comments;
