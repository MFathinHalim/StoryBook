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
    let result = await userInstance.login(username.trim(), password);

    if (result.username === "system") {
      return NextResponse.json({ error: 'System user not allowed' }, { status: 400 });
    }

    const tokenFunction = await userInstance.createAccessToken(result._id.toString());
    const token = tokenFunction.newToken;

    // Create a response instance
    const response = NextResponse.json({ token });

    // Set cookies
    response.cookies.set('refreshtoken', tokenFunction.refreshToken, {
      path: '/api/refreshToken',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}