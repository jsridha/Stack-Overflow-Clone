export default function makeUrl(page, id, order) {
    let contentUrl = 'http://localhost:8000/';
    if(page === 'questions') {
        if (!id){
            return contentUrl + page + '/' + order;
        }
        else {
            return contentUrl + page + '/' + id + '/answers';
        }
    } else if(page === 'tags') {
        if (!id){
            return contentUrl + page;
        } else {
            return contentUrl + page + '/' + id;
        }
    }
}