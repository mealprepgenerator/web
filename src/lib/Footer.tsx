import * as React from "react";

import {
  Column,
  Columns,
  Container,
  Content,
  Footer as BloomerFooter,
  Icon,
} from "bloomer";

const Footer: React.SFC = () => (
  <BloomerFooter>
    <Container>
      <Content>
        <Columns>
          <Column isSize="full">
            <p>
              Made with<Icon hasTextColor="danger" className="fa fa-heart" />
              by <a href="https://github.com/jankdc">Jan Karlo Dela Cruz</a>
            </p>
          </Column>
        </Columns>
        <Content isSize="small">
          <p>
            The source code is licensed under <a
              href="https://opensource.org/licenses/mit-license.php"
              target="_blank"
            >
              MIT
            </a>
            .
          </p>
          <p>
            The website content is licensed under <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0"
              target="_blank"
            >
              CC ANS 4.0
            </a>
            .
          </p>
        </Content>
      </Content>
    </Container>
  </BloomerFooter>
);

export default Footer;
