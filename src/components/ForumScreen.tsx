import { useState } from "react";
import { MessageSquare, ThumbsUp, Tag, Plus, Send, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useCountry } from "@/lib/CountryContext";
import AnimatedPage from "./AnimatedPage";
import MotionCard from "./MotionCard";

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  tags: string[];
  upvotes: number;
  comments: number;
  time: string;
  upvoted: boolean;
}

const tagColors: Record<string, string> = {
  Housing: "bg-primary/10 text-primary",
  Visas: "bg-destructive/10 text-destructive",
  Meetups: "bg-accent/10 text-accent",
  Jobs: "bg-warning/10 text-warning",
  Transport: "bg-primary/10 text-primary",
  Food: "bg-accent/10 text-accent",
  Safety: "bg-destructive/10 text-destructive",
  Tips: "bg-warning/10 text-warning",
};

const initialPosts: Post[] = [
  { id: 1, author: "Rajan M.", avatar: "RM", content: "Anyone know a good landlord near Little India area? Looking for a shared room under $800/month. Must be near MRT.", tags: ["Housing", "Tips"], upvotes: 24, comments: 8, time: "2h ago", upvoted: false },
  { id: 2, author: "Maria L.", avatar: "ML", content: "My work permit renewal took only 3 days this time! Make sure to submit all documents via the portal, not in person. Saves so much time.", tags: ["Visas", "Tips"], upvotes: 42, comments: 15, time: "4h ago", upvoted: false },
  { id: 3, author: "Wei Chen", avatar: "WC", content: "Weekend football meetup this Saturday at East Coast Park, 4 PM. All nationalities welcome! We usually get 15-20 people. 🏈⚽", tags: ["Meetups"], upvotes: 31, comments: 12, time: "5h ago", upvoted: false },
  { id: 4, author: "Arjun S.", avatar: "AS", content: "PSA: Bus 170 is running 15 min late today due to checkpoint delays. Take MRT if you need to get to Woodlands on time.", tags: ["Transport"], upvotes: 18, comments: 5, time: "1h ago", upvoted: false },
  { id: 5, author: "Fatima A.", avatar: "FA", content: "Found an amazing halal restaurant in Geylang — authentic biryani for just $6! DM me for the exact location.", tags: ["Food", "Tips"], upvotes: 56, comments: 22, time: "6h ago", upvoted: false },
  { id: 6, author: "Takeshi N.", avatar: "TN", content: "Construction site safety reminder: Always check your harness clips before going up. Had a near miss today. Stay safe everyone! 🏗️", tags: ["Safety", "Jobs"], upvotes: 89, comments: 34, time: "8h ago", upvoted: false },
];

const ForumScreen = () => {
  const { t } = useI18n();
  const { countryLabel } = useCountry();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState("");

  const allTags = ["Housing", "Visas", "Meetups", "Jobs", "Transport", "Food", "Safety", "Tips"];

  const filtered = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts;

  const toggleUpvote = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, upvoted: !p.upvoted, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1 }
          : p
      )
    );
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      author: "You",
      avatar: "YO",
      content: newPost,
      tags: ["Tips"],
      upvotes: 0,
      comments: 0,
      time: "Just now",
      upvoted: false,
    };
    setPosts([post, ...posts]);
    setNewPost("");
    setShowCompose(false);
  };

  return (
    <AnimatedPage>
      <div className="space-y-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold">Community Forum</h1>
              <p className="text-xs text-muted-foreground">{countryLabel} • Share & connect</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowCompose(!showCompose)}
            className="rounded-xl gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Post
          </Button>
        </div>

        {/* Compose */}
        {showCompose && (
          <MotionCard className="p-4 space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share a tip, ask a question, or connect with the community…"
              className="w-full h-24 rounded-xl bg-muted/50 border border-border p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={submitPost} disabled={!newPost.trim()} className="rounded-xl gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Post
              </Button>
            </div>
          </MotionCard>
        )}

        {/* Tags */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedTag(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              !selectedTag
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card/80 border-border text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card/80 border-border text-foreground hover:bg-muted"
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {filtered.map((post, i) => (
            <MotionCard key={post.id} delay={i * 0.05} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{post.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{post.author}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {post.time}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-1 leading-relaxed">{post.content}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tagColors[tag] || "bg-muted text-muted-foreground"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => toggleUpvote(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    post.upvoted ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.upvoted ? "fill-primary" : ""}`} />
                  {post.upvotes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {post.comments}
                </button>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ForumScreen;
