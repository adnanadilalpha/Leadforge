import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getCurrentUser } from '@/lib/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('userId', '==', session.user.id));
    const querySnapshot = await getDocs(q);
    
    const leads = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const leadsRef = collection(db, 'leads');
    const docRef = await addDoc(leadsRef, {
      ...body,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const lead = {
      id: docRef.id,
      ...body,
      userId: session.user.id
    };

    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
