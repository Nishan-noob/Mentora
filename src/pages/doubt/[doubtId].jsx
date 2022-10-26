import { Button, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CommentCard from "../../components/CommentCard";
import LoaderComponent from "../../components/LoaderComponent";
import SubCommentCard from "../../components/SubCommentCard";
import { buttonOutlineClasses } from "../../utils/constants";
import { notSignedInNotification } from "../../utils/notification";

const DoubtDetailsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user?.email;

  const { doubtId } = router.query;
  const [answers, setAnswers] = useState([]);

  const [doubt, setDoubt] = useState(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!doubtId) return;
      const res = await fetch(`/api/answer/${doubtId}`);
      const data = await res.json();

      console.log("data:", data);
      pushSubAnswersToParent(data.data);
    };

    fetchAnswers();
  }, [doubtId]);

  const form = useForm({
    initialValues: {
      answer: "",
    },
    validate: {
      answer: (value) => (value.length > 10 ? null : "Too short"),
    },
  });
  const pushSubAnswersToParent = (answersData) => {
    if (!answersData) return;

    answersData.forEach((answer) => {
      if (answer.parent_id) {
        const parentAnswer = answersData.find(
          (c) => c._id === answer.parent_id
        );
        if (parentAnswer) {
          if (!parentAnswer.subAnswers) parentAnswer.subAnswers = [];
          parentAnswer.subAnswers.push(answer);
          answersData = answersData.filter((c) => c._id !== answer._id);
        }
      }
      setAnswers(answersData);
    });
  };

  const addAnswer = async () => {
    if (!session) {
      notSignedInNotification("Please sign in to Answer");
      return;
    }
    const validationResult = form.validate();
    if (Object.keys(validationResult.errors).length > 0) {
      return;
    }
    // setLoading(true);
    const res = await fetch(`/api/answer/${doubtId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.values),
    });

    const data = await res.json();
    if (data.error) {
      // throw error notifcation
    } else {
      //todo refetch the comments
      // show success notification
      form.reset();
    }
  };

  useEffect(() => {
    if (!doubtId) return;

    const fetchDoubtData = async () => {
      const res = await fetch(`/api/doubt/${doubtId}`);
      const data = await res.json();
      if (data.error) {
        // throw error notif
        return;
      }
      setDoubt(data.data);
    };
    fetchDoubtData();
  }, [doubtId]);

  const resolveDoubt = async () => {
    if (!doubtId || !session || doubt.user !== user) {
      // todo
      // show notifcation
      return;
    }

    const res = await fetch(`/api/doubt/${doubtId}/resolve`, { method: "PUT" });
    const updatedDoubtData = await res.json();

    if (updatedDoubtData.error) {
      // todo show notification
      return;
    }
    setDoubt(updatedDoubtData);
  };

  if (!doubt)
    return (
      <div className="flex h-[90vh]">
        <LoaderComponent />
      </div>
    );
  return (
    <div className="min-h-[90vh] flex flex-col">
      <div className="flex flex-1 justify-between">
        <div className="">
          <p className="text-3xl font-semibold">{doubt.title}</p>
          <p className="text-xl text-gray-400">{doubt.doubt}</p>
        </div>
        {console.log(user, doubt.user, doubt.status)}
        {user === doubt.user && doubt.status === "PENDING" && (
          <Button onClick={resolveDoubt} className={buttonOutlineClasses}>
            Mark as Resolved
            {/* {doubt.status === "RESOLVED" ? not : ""} */}
          </Button>
        )}

        {doubt.status === "RESOLVED" && (
          <p className="text-green-500 font-semibold">Resolved</p>
        )}
      </div>

      <div className="">
        <p className="text-xl font-semibold ">Answers</p>
        <Textarea
          placeholder="Wanna answer the question?"
          className="my-2"
          {...form.getInputProps("answer")}
        />
        <Button onClick={addAnswer} className={buttonOutlineClasses}>
          Add Answer
        </Button>

        <div className="space-y-4 mt-4">
          {answers?.length > 0 &&
            answers.map((answer, index) => (
              <div key={index}>
                <CommentCard
                  user={answer.user}
                  comment={answer.answer}
                  type="answer"
                  id={doubtId}
                  parentId={answer._id}
                />
                {answer?.subAnswers?.length > 0 &&
                  answer.subAnswers.map((subAnswer, index) => (
                    <SubCommentCard
                      key={index}
                      user={subAnswer.user}
                      comment={subAnswer.answer}
                    />
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default DoubtDetailsPage;
