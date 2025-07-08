import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {db} from '../firebase/firebase';

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const calculateStreak = (completedDates) => {
  const set = new Set(completedDates);
  let streak = 0;
  let d = new Date();
  while (true) {
    const str = d.toISOString().split('T')[0];
    if (set.has(str)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
};

const getLast7DayStatus = (datesList) => {
  const datesSet = new Set(datesList);
  return [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // past 7 days
    return datesSet.has(d.toISOString().split('T')[0]);
  });
};

export default function useStreakTracker() {
  const user = useRecoilValue(userAtom);
  const [completedDates, setCompletedDates] = useState([]);
  const [weekStreak, setWeekStreak] = useState(0);
  const [last7, setLast7] = useState(new Array(7).fill(false));

  useEffect(() => {
    if (!user?.userId) return;
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'users', user.userId));
      if (snap.exists()) {
        const data = snap.data();
        const completed = data.completedDates || [];
        setCompletedDates(completed);
        setWeekStreak(calculateStreak(completed));
        setLast7(getLast7DayStatus(completed));
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(async () => {
      const minutes = (Date.now() - start) / 60000;
      if (minutes >= 0.1 && user?.userId) {
        const todayStr = getTodayDateStr();
        if (!completedDates.includes(todayStr)) {
          const updated = [...completedDates, todayStr];
          setCompletedDates(updated);
          setWeekStreak(calculateStreak(updated));
          setLast7(getLast7DayStatus(updated));
          await updateDoc(doc(db, 'users', user.userId), {
            completedDates: updated,
          });
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [completedDates, user]);

  return { weekStreak, last7 };
}
