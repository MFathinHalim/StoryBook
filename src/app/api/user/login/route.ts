import Users from '@/controllers/user';
import { NextRequest, NextResponse } from 'next/server';

const userInstance = Users.getInstances();

/**
 * @param {NextRequest} req
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  try {
    let result = await userInstance.login(username, password);

    if (result.name === "Password or Username is incorrect!") {
      return NextResponse.json({ message: "The Password or Username is Incorrect" }, { status: 401 });
    }
    const tokenFunction = await userInstance.createAccessToken(result._id.toString());
    const token = tokenFunction.newToken;

    // Create a response instance
    const response = NextResponse.json({ token });

    // Set cookies
    response.cookies.set('refreshtoken', tokenFunction.refreshToken, {
      path: '/api/user/refreshToken',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
