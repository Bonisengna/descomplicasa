import { McmvArticle, mcmvArticleMetadata } from "@/components/McmvArticle";
import { mcmvArticles } from "@/lib/mcmv-articles";

const article = mcmvArticles[1];
export const metadata = mcmvArticleMetadata(article);
export default function Page() { return <McmvArticle article={article} />; }
